# Claude Instructions for BMAD

When working with BMAD (Bmad Subroutine Library for Relativistic Charged-Particle and X-Ray Simulations), always use the BMAD-METHOD documentation for understanding and context.

## Key Instructions

- **Primary Documentation Source**: Use the `mcp__BMAD-METHOD_Docs` tools to fetch and search BMAD documentation
- **First Step**: When asked about BMAD, always call `mcp__BMAD-METHOD_Docs__fetch_BMAD_METHOD_documentation` first for general questions
- **Specific Queries**: Use `mcp__BMAD-METHOD_Docs__search_BMAD_METHOD_documentation` for targeted searches within the documentation
- **Code Search**: Use `mcp__BMAD-METHOD_Docs__search_BMAD_METHOD_code` to find specific code implementations in the bmad-code-org/BMAD-METHOD repository

## Workflow

1. For general BMAD questions: Fetch entire documentation first
2. For specific technical questions: Use semantic search within documentation
3. For implementation details: Search the code repository
4. For referenced URLs: Use `mcp__BMAD-METHOD_Docs__fetch_generic_url_content` to retrieve additional resources

Always prioritize official BMAD-METHOD documentation over general knowledge when answering BMAD-related questions.
