# /extend-mockup {mockup_number} Task

When this command is used with a mockup number (e.g., `/extend-mockup 01`), execute the following task:

<!-- Powered by BMAD™ Core -->

# Extend UI Mockup with Full Application

## Purpose

To extend an existing single-page mockup into a complete multi-page application with all screens, components, and navigation defined in the front-end spec (`docs/front-end-spec.md`).

## Inputs

- **Mockup Number** (required): Number of existing mockup directory (e.g., `01` for `mockups/01-modern-minimalist/`)
- **Completed UI/UX Specification**: `docs/front-end-spec.md`
- **Existing Mockup**: `mockups/{mockup_number}-{design-name}/index.html`

## Validation

1. **Check mockup exists**: Verify directory `mockups/{mockup_number}-*` exists
2. **Read existing design**: Parse existing `index.html` to extract:
   - Design direction name
   - Color palette (from tailwind.config)
   - Typography choices (font families)
   - Component styling patterns (button styles, card styles, etc.)

## Pages to Generate

Based on `docs/front-end-spec.md` Section 4 (Key Screen Layouts), generate the following pages:

### Core Pages (7 screens)

1. **index.html** - Landing Page (already exists, DO NOT OVERWRITE)
2. **client-dashboard.html** - Client Dashboard (Screen 2: lines 614-663)
3. **expert-dashboard.html** - Expert Dashboard (derived from Opportunity Browser)
4. **opportunity-browser.html** - Opportunity Browser (Screen 3: lines 666-732)
5. **project-details.html** - Project Details (Screen 4: lines 736-830)
6. **qa-review.html** - QA Review Interface (Screen 5: lines 834-920)
7. **payments.html** - Payment/Escrow Management (Screen 6: lines 923-1011)
8. **earnings.html** - Expert Earnings Dashboard (Screen 7: lines 1014-1102)

### Component Files

Create a shared `components.js` file with all core components from Section 5:

1. OpportunityCard (lines 1121-1141)
2. StagePipeline (lines 1146-1164)
3. EscrowStatusWidget (lines 1168-1186)
4. BidForm (lines 1190-1210)
5. QAChecklistPanel (lines 1214-1231)
6. WalletConnectButton (lines 1235-1253)
7. TransactionStatusTracker (lines 1257-1276)
8. RoleSwitcher (lines 1280-1326)

### Navigation Component

Create shared navigation that appears on all pages (except Landing):

- **Mobile**: Bottom navigation (4 icons) + hamburger menu
- **Desktop/Tablet**: Top navigation bar with role switcher (lines 113-129)

## Technical Requirements

1. **Consistency with Existing Mockup**:
   - Extract color palette from existing `tailwind.config` in `index.html`
   - Reuse font families from existing mockup
   - Match button styles, card styles, and spacing patterns
   - Maintain same design aesthetic throughout

2. **React + shadcn-ui Components**:
   - Use same CDN approach as existing mockup (React, ReactDOM, Babel)
   - Use `mcp__shadcn-ui__get_component_demo` BEFORE `mcp__shadcn-ui__get_component`
   - Inline all component code (no external dependencies)
   - Components needed: Button, Card, Badge, Avatar, Tabs, Dropdown, Input, Textarea, Checkbox, Select, Dialog, Toast

3. **Navigation Integration**:
   - All pages (except index.html) include top/bottom navigation
   - Navigation highlights current page
   - Links between pages use relative paths (e.g., `href="client-dashboard.html"`)
   - Role switcher component (desktop: top nav, mobile: avatar menu)

4. **Responsive Design**:
   - Mobile-first approach (320px, 768px, 1024px, 1440px breakpoints)
   - Follow responsive patterns from front-end-spec.md Section 8 (lines 1472-1501)

5. **Accessibility**:
   - WCAG 2.1 AA compliance (front-end-spec.md Section 7, lines 1427-1467)
   - Semantic HTML
   - ARIA labels for custom components
   - Keyboard navigation support

6. **Placeholder Content**:
   - Use realistic data matching front-end-spec.md descriptions
   - Expert names: "Sarah Chen", "Marcus Rodriguez", "Priya Patel", etc.
   - Project names: "SaaS Analytics Dashboard", "E-commerce Mobile App", etc.
   - Use https://placehold.co/ for images (avatars, screenshots)

## Execution Steps

1. **Identify Mockup Directory**:
   ```bash
   # Find the mockup directory matching the number
   ls mockups/ | grep "^{mockup_number}-"
   ```

2. **Read Existing Mockup**:
   - Read `mockups/{mockup_number}-{design-name}/index.html`
   - Extract tailwind.config colors, fonts, and styling patterns

3. **Fetch shadcn-ui Components**:
   - For each required component, call `mcp__shadcn-ui__get_component_demo` first
   - Then call `mcp__shadcn-ui__get_component` to get source code
   - Create reusable component library in `components.js`

4. **Generate Pages**:
   - Create each HTML page using the existing mockup's styling
   - Follow exact screen layouts from front-end-spec.md Section 4
   - Include shared navigation component
   - Link pages together with relative URLs

5. **Create Components File**:
   - Write `mockups/{mockup_number}-{design-name}/components.js`
   - Include all 8 core components as React functional components
   - Export components for use in all pages

6. **Create Navigation File**:
   - Write `mockups/{mockup_number}-{design-name}/navigation.js`
   - Include TopNav (desktop/tablet) and BottomNav (mobile) components
   - Include RoleSwitcher component

7. **Update README**:
   - Create/update `mockups/{mockup_number}-{design-name}/README.md`
   - Document all pages and how to navigate between them
   - List all components with usage examples

## Page Template Structure

Each HTML page should follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Page Title] - American Nerd Marketplace - [Design Name]</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- React CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

    <!-- Babel Standalone -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <!-- Google Fonts (match existing mockup) -->
    <link href="[FONT_URL_FROM_EXISTING]" rel="stylesheet">

    <!-- Tailwind Custom Config (extracted from existing mockup) -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        // Colors from existing mockup
                    }
                }
            }
        }
    </script>
</head>
<body>
    <div id="root"></div>

    <!-- Shared Components -->
    <script type="text/babel" src="./components.js"></script>

    <!-- Navigation Components -->
    <script type="text/babel" src="./navigation.js"></script>

    <!-- Page-Specific Component -->
    <script type="text/babel">
        const { useState, useEffect } = React;

        // Import shared components
        // (components.js exports will be available globally)

        const [PageName] = () => {
            return (
                <div className="min-h-screen">
                    {/* Navigation */}
                    <TopNav currentPage="[page-name]" />

                    {/* Page Content */}
                    <main className="container mx-auto px-4 py-8">
                        {/* Screen layout from front-end-spec.md */}
                    </main>

                    {/* Mobile Bottom Nav */}
                    <BottomNav currentPage="[page-name]" className="md:hidden" />
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<[PageName] />);
    </script>
</body>
</html>
```

## Output Format

After generating all pages:

```
✅ Extended Mockup: [Design Direction Name]

📁 Location: /Users/jonathangreen/Documents/american_nerd/mockups/[mockup_number]-[design-name]/

📄 Pages Created:
   ✓ client-dashboard.html
   ✓ expert-dashboard.html
   ✓ opportunity-browser.html
   ✓ project-details.html
   ✓ qa-review.html
   ✓ payments.html
   ✓ earnings.html

🧩 Components Created:
   ✓ components.js (8 core components)
   ✓ navigation.js (TopNav, BottomNav, RoleSwitcher)

🌐 View Mockups:
   To view the mockups, start a local HTTP server first (required for external JS files):

   cd mockups/[mockup_number]-[design-name] && python3 -m http.server 8000

   Then open in browser:
   Landing Page:           http://localhost:8000/index.html
   Client Dashboard:       http://localhost:8000/client-dashboard.html
   Expert Dashboard:       http://localhost:8000/expert-dashboard.html
   Opportunity Browser:    http://localhost:8000/opportunity-browser.html
   Project Details:        http://localhost:8000/project-details.html
   QA Review Interface:    http://localhost:8000/qa-review.html
   Payments:               http://localhost:8000/payments.html
   Earnings:               http://localhost:8000/earnings.html

📖 Documentation: mockups/[mockup_number]-[design-name]/README.md
```

## Important Notes

- **DO NOT OVERWRITE** the existing `index.html` (Landing Page)
- **Maintain design consistency** - extract and reuse all styling from existing mockup
- **Follow front-end-spec.md exactly** for screen layouts and component specifications
- **Test navigation** - ensure all pages link together correctly
- **Use realistic placeholder data** - make it look like a real application
- **Ensure mobile responsiveness** - test at all breakpoints (320px, 768px, 1024px, 1440px)
- **Add interactive states** - hover effects, click feedback, active navigation highlighting

## Success Criteria

✅ All 7 new pages created with consistent design aesthetic
✅ Shared components library (components.js) with all 8 core components
✅ Navigation component (navigation.js) with role switcher
✅ Pages link together with relative URLs
✅ Mobile-responsive at all breakpoints
✅ Matches screen layouts from front-end-spec.md
✅ Works with local HTTP server (python3 -m http.server)
✅ README.md documents all pages, components, and how to run the server
