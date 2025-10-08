use anchor_lang::prelude::*;

/// Work account - deliverable submitted by AI node
/// PDA seeds: ["work", opportunity.key()]
/// Total size: 8 (discriminator) + 260 bytes = 268 bytes (approx)
#[account]
pub struct Work {
    /// Reference to opportunity (32 bytes)
    pub opportunity: Pubkey,
    /// Submitting AI node's wallet (32 bytes)
    pub node: Pubkey,
    /// Arweave transaction ID for deliverable (architecture.md or code snapshot) (4+64=68 bytes)
    pub deliverable_arweave_tx: String,
    /// GitHub commit SHA for code work (1+4+40=45 bytes)
    pub github_commit_sha: Option<String>,
    /// Pull request number for code work (1+8=9 bytes)
    pub github_pr_number: Option<u64>,
    /// Live deployment URL (1+4+200=205 bytes)
    pub staging_url: Option<String>,
    /// Validation status from automated checks (1 byte)
    pub validation_status: ValidationStatus,
    /// Reference to AutomatedValidation result account (1+32=33 bytes)
    pub automated_validation_id: Option<Pubkey>,
    /// Score from BMAD checklist 0-100 for architecture work (1+1=2 bytes)
    pub checklist_score: Option<u8>,
    /// Work submission timestamp (8 bytes)
    pub submitted_at: i64,
    /// Validation completion timestamp (1+8=9 bytes)
    pub validated_at: Option<i64>,
    /// PDA bump seed (1 byte)
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum ValidationStatus {
    Pending,
    AllPassed,
    SomeFailed,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_work_serialization() {
        let work = Work {
            opportunity: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            deliverable_arweave_tx: "a".repeat(64),
            github_commit_sha: Some("abc123def456".to_string()),
            github_pr_number: Some(42),
            staging_url: Some("https://staging.example.com".to_string()),
            validation_status: ValidationStatus::Pending,
            automated_validation_id: Some(Pubkey::new_unique()),
            checklist_score: Some(85),
            submitted_at: 1234567890,
            validated_at: None,
            bump: 255,
        };

        let data = work.try_to_vec().unwrap();
        assert!(!data.is_empty(), "Serialization should produce data");

        let deserialized = Work::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.opportunity, work.opportunity);
        assert_eq!(deserialized.node, work.node);
        assert_eq!(
            deserialized.deliverable_arweave_tx,
            work.deliverable_arweave_tx
        );
        assert_eq!(deserialized.github_commit_sha, work.github_commit_sha);
        assert_eq!(deserialized.github_pr_number, work.github_pr_number);
    }

    #[test]
    fn test_validation_status_serialization() {
        let statuses = vec![
            ValidationStatus::Pending,
            ValidationStatus::AllPassed,
            ValidationStatus::SomeFailed,
        ];

        for status in statuses {
            let data = status.clone().try_to_vec().unwrap();
            let deserialized = ValidationStatus::try_from_slice(&data).unwrap();
            assert_eq!(deserialized, status);
        }
    }

    #[test]
    fn test_work_architecture_submission() {
        // Architecture work typically has no GitHub commit/PR
        let work = Work {
            opportunity: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            deliverable_arweave_tx: "a".repeat(64),
            github_commit_sha: None,
            github_pr_number: None,
            staging_url: None,
            validation_status: ValidationStatus::AllPassed,
            automated_validation_id: None,
            checklist_score: Some(92),
            submitted_at: 1234567890,
            validated_at: Some(1234567890 + 3600),
            bump: 255,
        };

        let data = work.try_to_vec().unwrap();
        let deserialized = Work::try_from_slice(&data).unwrap();
        assert!(deserialized.github_commit_sha.is_none());
        assert!(deserialized.github_pr_number.is_none());
        assert_eq!(deserialized.checklist_score, Some(92));
    }

    #[test]
    fn test_work_code_submission() {
        // Code work has GitHub commit, PR, and staging URL
        let work = Work {
            opportunity: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            deliverable_arweave_tx: "a".repeat(64),
            github_commit_sha: Some("a".repeat(40)),
            github_pr_number: Some(123),
            staging_url: Some("https://story-123-preview.akash.network".to_string()),
            validation_status: ValidationStatus::AllPassed,
            automated_validation_id: Some(Pubkey::new_unique()),
            checklist_score: None, // No checklist for code work
            submitted_at: 1234567890,
            validated_at: Some(1234567890 + 1800),
            bump: 255,
        };

        let data = work.try_to_vec().unwrap();
        let deserialized = Work::try_from_slice(&data).unwrap();
        assert!(deserialized.github_commit_sha.is_some());
        assert!(deserialized.github_pr_number.is_some());
        assert!(deserialized.staging_url.is_some());
        assert!(deserialized.checklist_score.is_none());
    }

    #[test]
    fn test_work_validation_failure() {
        let work = Work {
            opportunity: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            deliverable_arweave_tx: "a".repeat(64),
            github_commit_sha: Some("failed_commit".to_string()),
            github_pr_number: Some(99),
            staging_url: None, // Deployment failed
            validation_status: ValidationStatus::SomeFailed,
            automated_validation_id: Some(Pubkey::new_unique()),
            checklist_score: None,
            submitted_at: 1234567890,
            validated_at: Some(1234567890 + 900),
            bump: 255,
        };

        let data = work.try_to_vec().unwrap();
        let deserialized = Work::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.validation_status, ValidationStatus::SomeFailed);
        assert!(deserialized.staging_url.is_none());
    }
}
