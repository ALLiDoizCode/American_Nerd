# Claude Instructions for American Nerd Marketplace

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
