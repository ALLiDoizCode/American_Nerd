# Epic 2: Arweave Integration (Milestone 0)

**Duration:** 2 weeks (parallel with Epic 1)

**Epic Goal:** Integrate Arweave permanent storage for all project documents (PRDs, architectures, stories, code submissions) using the Turbo SDK with SOL payments. This epic creates the document storage layer that enables trustless, immutable, and permanent access to all marketplace artifacts, ensuring AI nodes can always retrieve context and token holders can verify work. Arweave serves as the decentralized document backend that replaces traditional cloud storage.

---

## Story 2.1: Turbo SDK Integration

As a platform developer,
I want to integrate the Turbo SDK (@ardrive/turbo-sdk) for Arweave uploads,
so that we can upload documents to Arweave and pay with SOL instead of AR tokens.

### Acceptance Criteria

1. Turbo SDK installed: `npm install @ardrive/turbo-sdk` or `cargo add turbo-sdk` (depending on implementation language)
2. Turbo client initialized with Solana wallet configuration
3. Helper function `initializeTurboClient()` implemented:
   - Accepts Solana wallet keypair
   - Creates Turbo client instance
   - Handles authentication with Turbo service
4. Connection tested to Turbo API endpoint
5. SOL payment method configured (default payment token)
6. Error handling for network failures and authentication errors
7. Unit tests for client initialization
8. Integration test uploading small test file (<1KB) to Arweave
9. Verify transaction ID returned from upload
10. README documentation for Turbo SDK setup and usage

---

## Story 2.2: Document Upload Service

As a platform developer,
I want to implement a document upload service that accepts documents and uploads them to Arweave with SOL payments,
so that PRDs, architectures, and code submissions can be permanently stored.

### Acceptance Criteria

1. `uploadDocument()` function implemented with parameters:
   - document (Buffer or string - document content)
   - metadata (object - document metadata)
   - wallet (Solana keypair - for payment)
2. Function workflow:
   - Initializes Turbo client with wallet
   - Uploads document to Arweave via Turbo SDK
   - Pays for upload with SOL (automatic conversion via Turbo)
   - Returns Arweave transaction ID
3. Cost calculation function `estimateUploadCost(fileSize: number)` implemented:
   - Estimates SOL cost based on file size
   - Queries Turbo pricing API
   - Returns estimated cost in lamports
4. Upload status tracking (pending, confirmed, failed)
5. Retry logic for failed uploads (3 attempts with exponential backoff)
6. Error handling for insufficient SOL balance
7. Unit tests for upload function
8. Unit tests for cost estimation
9. Integration tests:
   - Upload 1KB document (PRD excerpt)
   - Upload 100KB document (full architecture)
   - Upload 1MB document (large code submission)
10. Verify all uploaded documents accessible via `https://arweave.net/{tx-id}`

---

## Story 2.3: Document Download Service

As a platform developer,
I want to implement a document download service that fetches documents from Arweave by transaction ID,
so that AI nodes can retrieve PRDs, architectures, and stories for execution.

### Acceptance Criteria

1. `downloadDocument(txId: string)` function implemented:
   - Accepts Arweave transaction ID
   - Fetches document from `https://arweave.net/{txId}`
   - Returns document content as string or Buffer
2. Caching layer implemented:
   - Cache downloaded documents locally (temporary directory)
   - Cache key: transaction ID
   - Cache expiration: 24 hours or configurable
   - Reduces redundant downloads for frequently accessed documents
3. Error handling for:
   - Invalid transaction ID
   - Document not found (404)
   - Network timeouts
   - Document not yet confirmed on Arweave
4. Retry logic for failed downloads (3 attempts)
5. Helper function `isDocumentConfirmed(txId: string)` implemented:
   - Checks if Arweave transaction is confirmed
   - Returns boolean and confirmation count
6. Unit tests for download function
7. Unit tests for caching logic
8. Integration tests:
   - Download document uploaded in Story 2.2
   - Verify content matches original upload
   - Test cache hit (second download faster)
9. Performance benchmark: Download 100KB document in <2 seconds

---

## Story 2.4: Metadata Tagging

As a platform developer,
I want to implement metadata tagging for uploaded documents,
so that documents can be categorized, searched, and filtered by type, project, and BMAD document category.

### Acceptance Criteria

1. Metadata schema defined:
   ```typescript
   interface DocumentMetadata {
     project_id: string;          // Solana project account pubkey
     document_type: 'prd' | 'architecture' | 'story' | 'code_submission' | 'qa_report';
     bmad_version: string;        // BMAD template version (e.g., "2.0")
     created_at: number;          // Unix timestamp
     author: string;              // Solana pubkey of uploader
     story_id?: string;           // Optional: "1.2" for stories/code
     file_size: number;           // Bytes
     mime_type: string;           // "text/markdown", "application/zip", etc.
   }
   ```
2. `uploadDocumentWithMetadata()` function implemented:
   - Accepts document + metadata object
   - Encodes metadata as Arweave tags
   - Uploads document with tags via Turbo SDK
3. Arweave tags mapped from metadata:
   - Tag: "Project-Id" → metadata.project_id
   - Tag: "Document-Type" → metadata.document_type
   - Tag: "BMAD-Version" → metadata.bmad_version
   - Tag: "Created-At" → metadata.created_at
   - Tag: "Author" → metadata.author
   - Tag: "Story-Id" → metadata.story_id (if present)
4. Helper function `parseDocumentMetadata(txId: string)` implemented:
   - Fetches Arweave transaction metadata
   - Parses tags into DocumentMetadata object
   - Returns metadata object
5. Unit tests for metadata encoding/decoding
6. Integration tests:
   - Upload PRD with metadata
   - Fetch and verify metadata tags on Arweave
   - Upload story with story_id tag
7. Metadata validation (required fields present)

---

## Story 2.5: Cost Tracking and Optimization

As a platform developer,
I want to implement cost tracking for Arweave uploads and optimize upload costs,
so that platform economics remain viable and cost per upload is minimized.

### Acceptance Criteria

1. Cost tracking database/storage implemented:
   - Tracks each upload: txId, fileSize, solCost, timestamp
   - Aggregates total SOL spent on Arweave storage
   - Aggregates total bytes uploaded
2. Analytics functions implemented:
   - `getTotalStorageCost()`: Returns total SOL spent
   - `getAverageCostPerMB()`: Returns average cost per MB uploaded
   - `getCostByDocumentType()`: Returns costs grouped by type (PRD, architecture, etc.)
3. Cost optimization techniques implemented:
   - Compression: Gzip compress documents before upload (reduces size by ~70%)
   - Deduplication: Check if identical document already uploaded (hash comparison)
   - Batching: Combine multiple small documents into single upload (if applicable)
4. Helper function `compressDocument(content: string)` implemented:
   - Gzip compresses document
   - Returns compressed buffer
   - Tagged with "Content-Encoding: gzip" on Arweave
5. Helper function `decompressDocument(buffer: Buffer)` implemented:
   - Decompresses gzip buffer
   - Returns original content
6. Cost reporting:
   - Weekly cost report function
   - Breakdown by document type and project
   - Alerts if costs exceed threshold
7. Unit tests for compression/decompression
8. Integration tests:
   - Upload compressed vs uncompressed document
   - Verify cost savings (~70% reduction)
   - Upload duplicate document (verify deduplication)
9. Performance benchmark: Compression adds <100ms overhead
10. Documentation of cost optimization strategies

---

**Epic 2 Success Criteria:**
- ✅ Documents permanently stored on Arweave
- ✅ SOL payments working via Turbo SDK
- ✅ Upload and download services operational
- ✅ Metadata tagging enables document categorization
- ✅ Cost tracking provides visibility into storage expenses
- ✅ Compression reduces upload costs by ~70%
- ✅ All uploaded documents accessible via HTTPS URLs
- ✅ Integration tests pass for upload/download workflows

---
