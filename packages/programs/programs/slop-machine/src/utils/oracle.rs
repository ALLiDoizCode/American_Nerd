use crate::errors::ErrorCode;
use anchor_lang::prelude::*;

// Pyth constants
const PYTH_MAGIC: u32 = 0xa1b2c3d4;
const PYTH_VERSION_2: u32 = 2;
const PYTH_ACCOUNT_TYPE_PRICE: u32 = 3;

/// Maximum price staleness in slots (30 seconds ≈ 75 slots at 400ms/slot)
pub const MAX_PRICE_STALENESS_SLOTS: u64 = 75;

/// Slippage tolerance in basis points (100 = 1%)
pub const SLIPPAGE_TOLERANCE_BPS: u64 = 100;

/// Minimum SOL/USD price ($20)
pub const MIN_SOL_PRICE_USD: f64 = 20.0;

/// Maximum SOL/USD price ($500)
pub const MAX_SOL_PRICE_USD: f64 = 500.0;

/// Maximum confidence ratio (10% of price)
pub const MAX_CONFIDENCE_RATIO: f64 = 0.10;

/// Price data structure with validation metadata
#[derive(Debug, Clone)]
pub struct PriceData {
    pub price: f64,
    pub conf: f64,
    pub timestamp_slot: u64,
    pub is_validated: bool,
}

/// Manually parse Pyth price account without SDK
///
/// This avoids all borsh version conflicts by using direct byte slicing
pub fn get_sol_price_usd(pyth_price_account: &AccountInfo, clock: &Clock) -> Result<PriceData> {
    let data = pyth_price_account.data.borrow();

    // Validate minimum account size (Price struct is at least 3312 bytes)
    require!(data.len() >= 3312, ErrorCode::OraclePriceUnavailable);

    // Parse header (first 16 bytes)
    let magic = u32::from_le_bytes([data[0], data[1], data[2], data[3]]);
    let version = u32::from_le_bytes([data[4], data[5], data[6], data[7]]);
    let atype = u32::from_le_bytes([data[8], data[9], data[10], data[11]]);

    // Validate header
    require!(magic == PYTH_MAGIC, ErrorCode::OracleAccountInvalid);
    require!(version == PYTH_VERSION_2, ErrorCode::OracleAccountInvalid);
    require!(
        atype == PYTH_ACCOUNT_TYPE_PRICE,
        ErrorCode::OracleAccountInvalid
    );

    // Parse price exponent (offset 20, i32)
    let expo_bytes = [data[20], data[21], data[22], data[23]];
    let expo = i32::from_le_bytes(expo_bytes);

    // Parse aggregate price info (starts at offset 208)
    // PriceInfo layout: price(i64), conf(u64), status(u32), corp_act(u32), pub_slot(u64)
    let agg_price_offset = 208;

    // Extract price (i64 at offset 208)
    let price_bytes = [
        data[agg_price_offset],
        data[agg_price_offset + 1],
        data[agg_price_offset + 2],
        data[agg_price_offset + 3],
        data[agg_price_offset + 4],
        data[agg_price_offset + 5],
        data[agg_price_offset + 6],
        data[agg_price_offset + 7],
    ];
    let price_raw = i64::from_le_bytes(price_bytes);

    // Extract confidence (u64 at offset 216)
    let conf_bytes = [
        data[agg_price_offset + 8],
        data[agg_price_offset + 9],
        data[agg_price_offset + 10],
        data[agg_price_offset + 11],
        data[agg_price_offset + 12],
        data[agg_price_offset + 13],
        data[agg_price_offset + 14],
        data[agg_price_offset + 15],
    ];
    let conf_raw = u64::from_le_bytes(conf_bytes);

    // Extract publication slot (u64 at offset 232)
    let pub_slot_bytes = [
        data[agg_price_offset + 24],
        data[agg_price_offset + 25],
        data[agg_price_offset + 26],
        data[agg_price_offset + 27],
        data[agg_price_offset + 28],
        data[agg_price_offset + 29],
        data[agg_price_offset + 30],
        data[agg_price_offset + 31],
    ];
    let pub_slot = u64::from_le_bytes(pub_slot_bytes);

    // Convert to f64 with exponent
    let price_f64 = (price_raw as f64) * 10_f64.powi(expo);
    let conf_f64 = (conf_raw as f64) * 10_f64.powi(expo);

    // Validate price range (sanity check)
    require!(
        price_f64 >= MIN_SOL_PRICE_USD && price_f64 <= MAX_SOL_PRICE_USD,
        ErrorCode::OraclePriceOutOfRange
    );

    // Check staleness (publication slot vs current slot)
    let slot_diff = clock.slot.saturating_sub(pub_slot);
    require!(
        slot_diff <= MAX_PRICE_STALENESS_SLOTS,
        ErrorCode::OraclePriceStale
    );

    // Validate confidence interval (reject if confidence > 10% of price)
    let conf_ratio = conf_f64 / price_f64;
    require!(
        conf_ratio <= MAX_CONFIDENCE_RATIO,
        ErrorCode::OraclePriceUnavailable
    );

    Ok(PriceData {
        price: price_f64,
        conf: conf_f64,
        timestamp_slot: pub_slot,
        is_validated: true,
    })
}

/// Convert USD amount to lamports with slippage tolerance
pub fn usd_to_lamports(
    usd_amount: f64,
    pyth_price_account: &AccountInfo,
    clock: &Clock,
) -> Result<u64> {
    // Validate positive amount
    require!(usd_amount > 0.0, ErrorCode::InvalidAmount);

    // Get current SOL/USD price
    let price_data = get_sol_price_usd(pyth_price_account, clock)?;

    // Calculate SOL amount
    let sol_amount = usd_amount / price_data.price;

    // Apply 1% slippage tolerance (round up to ensure sufficient SOL)
    let sol_with_slippage = sol_amount * (1.0 + (SLIPPAGE_TOLERANCE_BPS as f64 / 10000.0));

    // Convert to lamports (round up using ceil())
    let lamports = (sol_with_slippage * 1_000_000_000.0).ceil() as u64;

    // Validate result (prevent overflow)
    require!(
        lamports > 0 && lamports < u64::MAX / 2,
        ErrorCode::InvalidAmount
    );

    Ok(lamports)
}

/// Convert lamports to USD equivalent
pub fn lamports_to_usd(
    lamports: u64,
    pyth_price_account: &AccountInfo,
    clock: &Clock,
) -> Result<f64> {
    // Get current SOL/USD price
    let price_data = get_sol_price_usd(pyth_price_account, clock)?;

    // Convert lamports to SOL
    let sol_amount = lamports as f64 / 1_000_000_000.0;

    // Calculate USD equivalent
    let usd_amount = sol_amount * price_data.price;

    Ok(usd_amount)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_price_range_validation() {
        // Test that MIN/MAX constants are reasonable
        assert!(MIN_SOL_PRICE_USD > 0.0);
        assert!(MAX_SOL_PRICE_USD > MIN_SOL_PRICE_USD);
        assert!(MAX_SOL_PRICE_USD < 1000.0); // Sanity check
    }

    #[test]
    fn test_slippage_calculation() {
        let usd = 100.0_f64;
        let price = 100.0_f64; // $100/SOL
        let sol = usd / price; // 1.0 SOL
        let with_slippage = sol * 1.01; // 1.01 SOL
        let lamports = (with_slippage * 1e9_f64).ceil() as u64;
        assert_eq!(lamports, 1_010_000_000);
    }
}
