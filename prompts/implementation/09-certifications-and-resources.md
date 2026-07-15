
# PTKP Implementation Prompt

Milestone: 9

Name: Certifications and Resources

Status: Approved

---

# Purpose

Implement the Certification and Resource systems for the Personal Technical Knowledge Platform (PTKP).

This milestone establishes two complementary knowledge domains:

- Certifications, which document verified professional knowledge and learning achievements.
- Resources, which provide carefully curated references for continuous learning.

Neither section should resemble a resume or a list of links. They should be integrated into the overall knowledge architecture and help visitors understand the relationship between learning, practical experience, and technical expertise.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/CONTENT_MODEL.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/COMPONENT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/CODING_STANDARDS.md
- docs/VOICE_AND_WRITING.md
- docs/ACCESSIBILITY.md
- docs/PERFORMANCE.md
- docs/SEO_GUIDE.md

These documents are authoritative.

---

# Objective

Implement reusable Certification and Resource listing pages and detail pages using Astro Content Collections and the existing component library.

The implementation must strengthen the PTKP knowledge graph by connecting certifications, technologies, projects, articles, architecture guides, and learning paths.

---

# Scope

Implement:

## Certifications

- Certification index page
- Individual certification pages
- Shared certification layout
- Certification metadata
- Issuing organization
- Issue date
- Expiration date (when applicable)
- Credential ID (optional)
- Verification link support
- Skills covered
- Related Technologies
- Related Projects
- Related Knowledge Assets
- Related Learning Paths
- Previous / Next navigation
- Breadcrumb navigation

---

## Resources

Implement:

- Resource index page
- Individual resource pages
- Resource metadata
- Resource categories
- Resource types
- External reference support
- Internal reference support
- Difficulty level
- Estimated study time
- Related Technologies
- Related Articles
- Related Projects
- Related Learning Paths
- Previous / Next navigation
- Breadcrumb navigation

---

# Requirements

The implementation must:

- Read Certifications and Resources exclusively from Astro Content Collections.
- Use shared layouts.
- Support MDX.
- Support Mermaid diagrams where appropriate.
- Support syntax highlighting.
- Support responsive tables.
- Display metadata consistently.
- Display relationships between all supported content types.
- Support future expansion without structural changes.
- Meet WCAG 2.2 AA requirements.

---

# Certification Page Layout

Each Certification page should contain:

1. Breadcrumb
2. Certification Name
3. Issuing Organization
4. Short Description
5. Metadata
6. Skills Validated
7. Technologies Covered
8. Practical Experience
9. Related Projects
10. Related Knowledge Assets
11. Related Learning Paths
12. Verification Information
13. Previous / Next Navigation
14. Footer

The emphasis should be on demonstrating practical knowledge rather than displaying badges.

---

# Resource Page Layout

Each Resource page should contain:

1. Breadcrumb
2. Resource Title
3. Resource Type
4. Metadata
5. Difficulty
6. Estimated Study Time
7. Summary
8. Why It Matters
9. Related Technologies
10. Related Articles
11. Related Projects
12. Related Learning Paths
13. External References
14. Previous / Next Navigation
15. Footer

Resources should help visitors continue learning beyond PTKP.

---

# Deliverables

Implement:

- Shared Certification layout
- Shared Resource layout
- Certification listing page
- Resource listing page
- Dynamic routes
- Metadata rendering
- Relationship rendering
- Verification link support
- Resource helper utilities
- Placeholder Certification entries
- Placeholder Resource entries
- Navigation between entries

---

# Accessibility

Ensure:

- Semantic HTML
- Proper heading hierarchy
- Accessible external links
- Accessible metadata presentation
- Keyboard navigation
- Visible focus indicators
- WCAG 2.2 AA compliance

---

# Performance

The implementation should:

- Prefer static rendering
- Hydrate only interactive elements
- Minimize JavaScript
- Optimize page rendering
- Maintain fast page loads

---

# SEO

Implement:

- Dynamic page titles
- Meta descriptions
- Open Graph metadata
- Canonical URLs
- Structured metadata
- Structured heading hierarchy

---

# Definition of Done

This milestone is considered complete only when:

- All required deliverables are implemented.
- Certification pages render correctly.
- Resource pages render correctly.
- Shared layouts are reused consistently.
- Content relationships display correctly.
- Type checking, linting, formatting, and build all succeed.
- Accessibility requirements are satisfied.
- No known defects remain within the milestone scope.

---

# Validation

Before completing the task verify:

- npm run dev succeeds
- npm run build succeeds
- npm run check succeeds
- Linting passes
- Formatting passes
- Certification routes render correctly
- Resource routes render correctly
- Related content renders correctly
- Verification links function correctly
- Responsive layouts verified

---

# Out of Scope

Do not implement:

- Search
- RSS
- Sitemap
- Analytics
- Authentication
- User accounts
- Comments
- Ratings
- Bookmarking
- Content recommendations

If uncertain whether a feature belongs to this milestone, exclude it.

---

# Expected Output

Provide:

1. Summary of implementation
2. Certification directory structure
3. Resource directory structure
4. Dynamic routes created
5. Shared layouts created
6. Helper utilities created
7. Relationship model summary
8. Accessibility considerations
9. Performance considerations
10. SEO implementation summary
11. Assumptions requiring approval

Do not implement anything beyond this milestone.

---

# Definition of Done

This milestone is considered complete only when:

- All required deliverables are implemented.
- The implementation complies with the project specifications.
- No placeholder UI components are introduced outside the defined scope.
- Type checking, linting, formatting, and build all succeed.
- Accessibility requirements are satisfied.
- No known defects remain within the milestone scope.


## Additional Implementation Instructions

1. Certifications are evidence of validated knowledge, not marketing achievements.

2. Avoid visual designs that resemble résumé websites or badge galleries.

3. Resources are curated references, not simple collections of external links.

4. Reuse existing layouts and UI components whenever possible.

5. Do not duplicate rendering logic already implemented for Knowledge Assets or Technology Pages.

6. All relationships between Certifications, Resources, Technologies, Projects, Articles, and Learning Paths must be data-driven through Astro Content Collections.

7. The implementation must remain static-first and fully compatible with Cloudflare Pages.

8. Placeholder content should reflect realistic enterprise technologies used throughout PTKP (for example: Kubernetes, VMware Cloud Foundation, OpenShift, GitLab CI/CD, Dell PowerFlex, Terraform, Ansible, Django, Oracle Database), maintaining consistency with the rest of the platform.