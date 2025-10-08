use anchor_lang::prelude::*;

/// Project account - represents a client's software project
/// PDA seeds: ["project", client.key(), project_nonce.to_le_bytes()]
/// Total size: 8 (discriminator) + 256 bytes = 264 bytes
#[account]
pub struct Project {
    /// Project owner's wallet address (32 bytes)
    pub client: Pubkey,
    /// PRD document Arweave transaction ID (4+64=68 bytes)
    pub prd_arweave_tx: String,
    /// GitHub repository URL (4+100=104 bytes)
    pub github_repo: String,
    /// Current project status (1 byte)
    pub status: ProjectStatus,
    /// Funding mechanism (1 byte)
    pub funding_type: FundingType,
    /// Token mint address if token-funded (1+32=33 bytes)
    pub token_mint: Option<Pubkey>,
    /// Creation timestamp (8 bytes)
    pub created_at: i64,
    /// Last update timestamp (8 bytes)
    pub updated_at: i64,
    /// PDA bump seed (1 byte)
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum ProjectStatus {
    Created,
    ArchitectureInProgress,
    StoriesInProgress,
    Completed,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum FundingType {
    SelfFunded,
    TokenFunded,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_project_serialization() {
        let project = Project {
            client: Pubkey::new_unique(),
            prd_arweave_tx: "a".repeat(64),
            github_repo: "https://github.com/test/repo".to_string(),
            status: ProjectStatus::Created,
            funding_type: FundingType::SelfFunded,
            token_mint: None,
            created_at: 1234567890,
            updated_at: 1234567890,
            bump: 255,
        };

        let data = project.try_to_vec().unwrap();
        assert!(!data.is_empty(), "Serialization should produce data");

        let deserialized = Project::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.client, project.client);
        assert_eq!(deserialized.prd_arweave_tx, project.prd_arweave_tx);
        assert_eq!(deserialized.status, project.status);
    }

    #[test]
    fn test_project_status_serialization() {
        let statuses = vec![
            ProjectStatus::Created,
            ProjectStatus::ArchitectureInProgress,
            ProjectStatus::StoriesInProgress,
            ProjectStatus::Completed,
            ProjectStatus::Cancelled,
        ];

        for status in statuses {
            let data = status.clone().try_to_vec().unwrap();
            let deserialized = ProjectStatus::try_from_slice(&data).unwrap();
            assert_eq!(deserialized, status);
        }
    }

    #[test]
    fn test_funding_type_serialization() {
        let types = vec![FundingType::SelfFunded, FundingType::TokenFunded];

        for funding_type in types {
            let data = funding_type.clone().try_to_vec().unwrap();
            let deserialized = FundingType::try_from_slice(&data).unwrap();
            assert_eq!(deserialized, funding_type);
        }
    }

    #[test]
    fn test_project_with_token_mint() {
        let project = Project {
            client: Pubkey::new_unique(),
            prd_arweave_tx: "a".repeat(64),
            github_repo: "https://github.com/test/repo".to_string(),
            status: ProjectStatus::Created,
            funding_type: FundingType::TokenFunded,
            token_mint: Some(Pubkey::new_unique()),
            created_at: 1234567890,
            updated_at: 1234567890,
            bump: 255,
        };

        let data = project.try_to_vec().unwrap();
        let deserialized = Project::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.token_mint, project.token_mint);
        assert_eq!(deserialized.funding_type, FundingType::TokenFunded);
    }
}
