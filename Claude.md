# Claude Instructions for Slop Machine

## BMAD Integration

When working with BMAD (Bmad Subroutine Library for Relativistic Charged-Particle and X-Ray Simulations), always use the BMAD-METHOD documentation for understanding and context.

### Key Instructions

- **Primary Documentation Source**: Use the `mcp__BMAD-METHOD_Docs` tools to fetch and search BMAD documentation
- **First Step**: When asked about BMAD, always call `mcp__BMAD-METHOD_Docs__fetch_BMAD_METHOD_documentation` first for general questions
- **Specific Queries**: Use `mcp__BMAD-METHOD_Docs__search_BMAD_METHOD_documentation` for targeted searches within the documentation
- **Code Search**: Use `mcp__BMAD-METHOD_Docs__search_BMAD_METHOD_code` to find specific code implementations in the bmad-code-org/BMAD-METHOD repository

### BMAD Workflow

1. For general BMAD questions: Fetch entire documentation first
2. For specific technical questions: Use semantic search within documentation
3. For implementation details: Search the code repository
4. For referenced URLs: Use `mcp__BMAD-METHOD_Docs__fetch_generic_url_content` to retrieve additional resources

Always prioritize official BMAD-METHOD documentation over general knowledge when answering BMAD-related questions.

## mem0 Integration

When working with mem0 (the memory layer for AI applications), always use the mem0 Docs MCP server for understanding and context.

### Key Instructions

- **Primary Documentation Source**: Use the `mcp__mem0_Docs` tools to fetch and search mem0 documentation
- **First Step**: When asked about mem0, always call `mcp__mem0_Docs__fetch_mem0_documentation` first for general questions
- **Specific Queries**: Use `mcp__mem0_Docs__search_mem0_documentation` for targeted searches within the documentation
- **Code Search**: Use `mcp__mem0_Docs__search_mem0_code` to find specific code implementations in the mem0ai/mem0 repository

### mem0 Workflow

1. For general mem0 questions: Fetch entire documentation first
2. For specific technical questions: Use semantic search within documentation
3. For implementation details: Search the code repository
4. For referenced URLs: Use `mcp__mem0_Docs__fetch_generic_url_content` to retrieve additional resources

### When to Use mem0

- Implementing memory persistence for AI agents
- Managing user context and conversation history
- Building personalized AI experiences
- Storing and retrieving long-term memory for AI workflows
- Integrating memory capabilities into the marketplace's AI features

Always prioritize official mem0 documentation over general knowledge when answering mem0-related questions.

## GitHub MCP Server Integration

When working with the GitHub MCP Server, always use the github-mcp-server Docs for understanding and context.

### Key Instructions

- **Primary Documentation Source**: Use the `mcp__github-mcp-server_Docs` tools to fetch and search GitHub MCP Server documentation
- **First Step**: When asked about the GitHub MCP Server, always call `mcp__github-mcp-server_Docs__fetch_github-mcp-server_documentation` first for general questions
- **Specific Queries**: Use `mcp__github-mcp-server_Docs__search_github-mcp-server_documentation` for targeted searches within the documentation
- **Code Search**: Use `mcp__github-mcp-server_Docs__search_github-mcp-server_code` to find specific code implementations

### GitHub MCP Server Workflow

1. For general GitHub MCP Server questions: Fetch entire documentation first
2. For specific technical questions: Use semantic search within documentation
3. For implementation details: Search the code repository
4. For referenced URLs: Use `mcp__github-mcp-server_Docs__fetch_generic_url_content` to retrieve additional resources

### When to Use GitHub MCP Server

- Integrating GitHub repositories with the marketplace
- Managing repository access and permissions
- Automating GitHub workflows
- Syncing project data with GitHub
- Implementing version control features
- Connecting AI agents with GitHub repositories

Always prioritize official GitHub MCP Server documentation over general knowledge when answering GitHub MCP Server-related questions.

## UI Development with shadcn-ui

When building UI components, always use shadcn-ui (v4) components for consistency and best practices.

### shadcn-ui Workflow

1. **Always check demo first**: Use `mcp__shadcn-ui__get_component_demo` BEFORE using `mcp__shadcn-ui__get_component` to understand:
   - How the component should be used
   - Common usage patterns
   - Props and configuration options
   - Integration examples

2. **Get component source**: After reviewing the demo, use `mcp__shadcn-ui__get_component` to get the actual component source code

3. **List available components**: Use `mcp__shadcn-ui__list_components` to discover available components when unsure what to use

4. **Get metadata**: Use `mcp__shadcn-ui__get_component_metadata` for detailed component information (dependencies, files, registry info)

5. **Use blocks for complex layouts**: Use `mcp__shadcn-ui__list_blocks` and `mcp__shadcn-ui__get_block` for pre-built complex UI patterns (dashboards, login pages, etc.)

### When to Use shadcn-ui

- Building new UI components or pages
- Adding forms, buttons, dialogs, cards, or any interactive elements
- Creating consistent, accessible UI patterns
- Implementing common layouts (authentication, dashboards, data tables, etc.)

## Integration Testing with Playwright

Use Playwright for all integration and end-to-end testing of the marketplace.

### Playwright Workflow

1. **Browser automation**: Use Playwright tools (`mcp__playwright__*`) for testing user flows
2. **Snapshot first**: Always use `mcp__playwright__browser_snapshot` to understand page state before taking actions
3. **Navigation**: Use `mcp__playwright__browser_navigate` to visit pages
4. **Interactions**: Use appropriate tools for clicking, typing, filling forms, etc.
5. **Verification**: Take screenshots or snapshots to verify expected outcomes

### When to Use Playwright

- Testing complete user workflows (registration, posting jobs, applying to jobs, payments)
- Verifying multi-page flows (expert onboarding, project submission, review cycles)
- Testing form submissions and validation
- Verifying responsive design across different viewport sizes
- Testing authentication and authorization flows
- Integration testing of payment flows (escrow, cryptocurrency)
- Validating AI integration points (BMAD workflow automation)

### Playwright Best Practices

- Always use `browser_snapshot` to understand the page before interacting
- Use semantic selectors (role, text) when possible
- Test critical paths: user registration → job posting → expert application → payment → delivery
- Test both success and error scenarios
- Verify state persistence across page reloads
- Test accessibility using snapshots
