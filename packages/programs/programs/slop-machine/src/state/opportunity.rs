use anchor_lang::prelude::*;

/// Opportunity account - represents available work for AI nodes
/// PDA seeds: ["opportunity", project.key(), work_type, nonce.to_le_bytes()]
/// Total size: 8 (discriminator) + 209 bytes = 217 bytes
#[account]
pub struct Opportunity {
    /// Parent project reference (32 bytes)
    pub project: Pubkey,
    /// Type of work required (1 byte)
    pub work_type: WorkType,
    /// Budget in lamports (8 bytes)
    pub budget_sol: u64,
    /// Budget USD equivalent at creation in cents (8 bytes)
    pub budget_usd_equivalent: u64,
    /// SOL/USD price from Pyth at creation time (8 bytes)
    pub sol_price_at_creation: u64,
    /// Requirements document Arweave transaction ID (4+64=68 bytes)
    pub requirements_arweave_tx: String,
    /// Current opportunity status (1 byte)
    pub status: OpportunityStatus,
    /// Winning bidder's wallet if assigned (1+32=33 bytes)
    pub assigned_node: Option<Pubkey>,
    /// Custom escrow PDA reference (32 bytes)
    pub escrow_account: Pubkey,
    /// Creation timestamp (8 bytes)
    pub created_at: i64,
    /// Optional deadline timestamp (1+8=9 bytes)
    pub deadline: Option<i64>,
    /// PDA bump seed (1 byte)
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum WorkType {
    Architecture,
    StoryImplementation,
    QAReview,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum OpportunityStatus {
    Open,
    Assigned,
    Completed,
    Cancelled,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_opportunity_serialization() {
        let opportunity = Opportunity {
            project: Pubkey::new_unique(),
            work_type: WorkType::Architecture,
            budget_sol: 1_000_000_000,    // 1 SOL
            budget_usd_equivalent: 15000, // $150 in cents
            sol_price_at_creation: 15000, // $150 per SOL
            requirements_arweave_tx: "a".repeat(64),
            status: OpportunityStatus::Open,
            assigned_node: None,
            escrow_account: Pubkey::new_unique(),
            created_at: 1234567890,
            deadline: Some(1234567890 + 86400),
            bump: 255,
        };

        let data = opportunity.try_to_vec().unwrap();
        assert!(!data.is_empty(), "Serialization should produce data");

        let deserialized = Opportunity::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.project, opportunity.project);
        assert_eq!(deserialized.budget_sol, opportunity.budget_sol);
        assert_eq!(deserialized.work_type, opportunity.work_type);
    }

    #[test]
    fn test_work_type_serialization() {
        let work_types = vec![
            WorkType::Architecture,
            WorkType::StoryImplementation,
            WorkType::QAReview,
        ];

        for work_type in work_types {
            let data = work_type.clone().try_to_vec().unwrap();
            let deserialized = WorkType::try_from_slice(&data).unwrap();
            assert_eq!(deserialized, work_type);
        }
    }

    #[test]
    fn test_opportunity_status_serialization() {
        let statuses = vec![
            OpportunityStatus::Open,
            OpportunityStatus::Assigned,
            OpportunityStatus::Completed,
            OpportunityStatus::Cancelled,
        ];

        for status in statuses {
            let data = status.clone().try_to_vec().unwrap();
            let deserialized = OpportunityStatus::try_from_slice(&data).unwrap();
            assert_eq!(deserialized, status);
        }
    }

    #[test]
    fn test_opportunity_with_assigned_node() {
        let opportunity = Opportunity {
            project: Pubkey::new_unique(),
            work_type: WorkType::StoryImplementation,
            budget_sol: 500_000_000,
            budget_usd_equivalent: 7500,
            sol_price_at_creation: 15000,
            requirements_arweave_tx: "a".repeat(64),
            status: OpportunityStatus::Assigned,
            assigned_node: Some(Pubkey::new_unique()),
            escrow_account: Pubkey::new_unique(),
            created_at: 1234567890,
            deadline: None,
            bump: 255,
        };

        let data = opportunity.try_to_vec().unwrap();
        let deserialized = Opportunity::try_from_slice(&data).unwrap();
        assert!(deserialized.assigned_node.is_some());
        assert_eq!(deserialized.assigned_node, opportunity.assigned_node);
    }
}
