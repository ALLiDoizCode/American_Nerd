# /generate-ui-mockup Task

When this command is used, execute the following task:

<!-- Powered by BMAD™ Core -->

# Generate Single UI Mockup Task

## Purpose

To generate a single visual mockup of the American Nerd Marketplace Landing Page that can be viewed locally in a browser.

## Inputs

- Completed UI/UX Specification (`docs/front-end-spec.md`)
- Design direction name and aesthetic guidelines (user will specify)

## Page Content

Focus on creating a mockup for the **Landing Page** which includes:
- Hero section with value proposition
- How It Works (4 steps)
- Workflow visualization (5 marketplace stages: PM → Architect → UX → Dev → QA, with MCP Brief shown as prerequisite)
- Featured experts section (3 expert cards)
- CTA buttons (Get Started with GitHub)
- Footer with links

## Implementation Requirements

1. **Use React with shadcn-ui components** for production frontend continuity
2. **Include React via CDN** for easy local viewing without build step:
   - React: `<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>`
   - ReactDOM: `<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>`
   - Babel Standalone: `<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>`
3. **Include Tailwind CDN**: `<script src="https://cdn.tailwindcss.com"></script>`
4. **Use shadcn-ui components via MCP tools** to match production frontend:
   - Use `mcp__shadcn-ui__get_component_demo` to understand component usage patterns
   - Use `mcp__shadcn-ui__get_component` to get actual component source code
   - Key components: Button, Card, Badge, Avatar (for featured experts)
   - Inline component code directly in the HTML file for standalone viewing
5. **Respect front-end-spec.md requirements**:
   - Follow exact content structure from Screen 1: Landing Page (docs/front-end-spec.md lines 562-611)
   - Use specified color palette from Section 6 (Primary: #2563EB, Secondary: #0EA5E9, etc.) or adapt per design direction
   - Follow typography scale (Inter font, H1: 36px/28px mobile, Body: 16px) or adapt per design direction
   - Implement mobile-first responsive breakpoints (320px, 768px, 1024px, 1440px)
6. **Make it fully responsive** (mobile-first approach as specified in front-end-spec.md)
7. **Use placeholder content** that matches the actual content from the spec
8. **Include placeholder images** using https://placehold.co/
9. **Ensure it's viewable by opening HTML file directly** (no build step, no server required)

## Technical Implementation

The mockup HTML file should include:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>American Nerd Marketplace - [Design Direction Name]</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- React CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

    <!-- Babel Standalone for JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <!-- Google Fonts (Inter or design-direction-specific) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Tailwind Custom Config -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        // Custom colors adapted per design direction
                        primary: '#2563EB',
                        secondary: '#0EA5E9',
                    }
                }
            }
        }
    </script>
</head>
<body>
    <div id="root"></div>

    <!-- Inline shadcn-ui components (Button, Card, Badge, Avatar) -->
    <script type="text/babel">
        // shadcn-ui components inlined here (Button, Card, Badge, Avatar)

        // Main App Component
        const App = () => {
            return (
                <div className="min-h-screen">
                    {/* Hero Section - front-end-spec.md lines 568-575 */}
                    <section className="hero container mx-auto px-4 py-16">
                        {/* Logo, tagline, H1, subheadline, CTA, trust badge */}
                    </section>

                    {/* How It Works - 4 cards (lines 577-580) */}
                    <section className="how-it-works container mx-auto px-4 py-12">
                        {/* 4 cards: Create Brief, Experts Bid, Escrow Protected, GitHub Delivery */}
                    </section>

                    {/* Workflow Visualization - 5 stages + MCP Brief (lines 582-585) */}
                    <section className="workflow container mx-auto px-4 py-12">
                        {/* PM → Architect → UX → Dev → QA (with MCP Brief prerequisite) */}
                    </section>

                    {/* Featured Experts - 3 cards (lines 587-589) */}
                    <section className="featured-experts container mx-auto px-4 py-12">
                        {/* 3 expert cards with Avatar + Card */}
                    </section>

                    {/* CTA Section */}
                    <section className="cta container mx-auto px-4 py-16 text-center">
                        {/* "Get Started with GitHub" button */}
                    </section>

                    {/* Footer (lines 596-598) */}
                    <footer className="py-8">
                        {/* Links: About, How It Works, For Experts, Pricing, Support */}
                    </footer>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
```

## Execution Steps

1. **Prompt user for design direction** if not already specified
2. **Create mockup directory**: `mockups/[design-name]/`
3. **Fetch shadcn-ui component demos and source** for Button, Card, Badge, Avatar
4. **Generate single HTML file** with inlined React components matching the Landing Page spec
5. **Open in browser** using Bash: `open mockups/[design-name]/index.html`

## Output Format

After generating the mockup:

```
✅ Generated UI Mockup: [Design Direction Name]

📁 Location: /Users/jonathangreen/Documents/american_nerd/mockups/[design-name]/

🌐 View Mockup:
   open mockups/[design-name]/index.html
```

## Important Notes

- **Ensure mobile-responsive** - test at 320px, 768px, 1024px, 1440px widths
- **Use semantic HTML** for accessibility
- **Include hover states** to show interactivity
- **Viewable without local server** - pure HTML/CSS/CDN resources
- **Focus on conveying the overall aesthetic** - don't obsess over pixel-perfection

## Success Criteria

✅ Single HTML mockup page created with design direction applied
✅ Matches Landing Page content structure from front-end-spec.md (lines 562-611)
✅ Uses shadcn-ui components (Button, Card, Badge, Avatar) inlined
✅ Mobile-responsive at all breakpoints
✅ Can be opened directly in browser (no build step)
