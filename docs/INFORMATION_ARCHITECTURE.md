# Information Architecture

Version: 1.0

---

# 1. Purpose

The Information Architecture (IA) defines how all knowledge within PTKP is organized, categorized, linked, searched, and discovered.

The IA prioritizes discoverability, scalability, and long-term maintainability over convenience.

Every content item must have a clear place within the platform and meaningful relationships to other content.



---


# Homepage Information Hierarchy

The homepage serves as the entry point to PTKP.

Its purpose is to introduce the platform and guide visitors toward relevant Knowledge Assets.

The homepage should remain focused and avoid information overload.

The recommended section order is:

1. Hero
2. Featured Knowledge Assets
3. Featured Projects
4. Technology Overview
5. Learning Paths
6. Recent Updates
7. Certifications
8. Footer

Each section should encourage exploration rather than present exhaustive lists.

---

# Primary Navigation

Version 1.0 uses the following primary navigation.

- Home
- Articles
- Projects
- Technologies
- Learning Paths
- Certifications
- Resources
- About

Navigation labels should remain stable across the platform.

Avoid changing navigation terminology without updating the Information Architecture.

---

# 3. Knowledge Section

Knowledge is the primary content hub.

It contains:

- Articles
- Lab Notes
- Tutorials
- Learning Paths

Knowledge is documentation-first, not blog-first.

---

# 4. Architecture Section

Architecture documents describe complete technical solutions.

Each architecture document should include:

- Overview
- Business Context
- Requirements
- Assumptions
- Architecture Diagram
- Components
- Networking
- Storage
- Security
- Deployment
- Operations
- Monitoring
- Backup
- Disaster Recovery
- Lessons Learned
- References

---

# 5. Projects

Projects represent real implementations.

Each project should contain:

- Executive Summary
- Background
- Problem Statement
- Objectives
- Environment
- Technologies
- Solution Design
- Implementation
- Challenges
- Lessons Learned
- Outcome
- Related Knowledge

Projects should reference Articles, Lab Notes, Architecture, Technologies, and Certifications wherever applicable.

---

# 6. Technologies

Each technology has a dedicated landing page.

Example:

Kubernetes

Contains:

- Overview
- Related Articles
- Related Projects
- Related Architecture
- Related Lab Notes
- Related Downloads
- Related Certifications
- External References

Technology pages become the central hub for a specific technology.

---

# 7. Certifications

Certifications are grouped by vendor.

Each certification should contain:

- Title
- Issuer
- Date
- Credential ID
- Verification URL
- Badge
- Skills
- Related Technologies
- Related Projects
- Related Articles

---

# 8. Resources

Resources include:

- Downloads
- Cheat Sheets
- Templates
- Scripts
- Presentations
- Reference Documents
- External Links

Resources should always relate to at least one technology or project.

---

# 9. About

Contains:

- Biography
- Professional Timeline
- Current Focus Areas
- Speaking (future)
- Contact
- Resume

This section is intentionally concise.

The platform should emphasize knowledge over biography.

---

# 10. Relationships

Every content type should support relationships.

Examples:

Article → Technology

Article → Project

Project → Architecture

Architecture → Technologies

Technology → Certifications

Certification → Articles

Lab Note → Technology

Resource → Project

Learning Path → Articles

Relationships should be bi-directional wherever practical.

---

# 11. Taxonomy

All content should support:

- Categories
- Tags
- Technologies
- Difficulty
- Series (optional)
- Related Content

Taxonomy should be consistent across all content types.

---

# 12. URL Structure

URLs should be descriptive, lowercase, and stable.

Examples:

/knowledge/articles/openshift-virtualization/

/projects/vmware-cloud-foundation/

/architecture/vks-network-design/

/technologies/kubernetes/

/certifications/aws-solutions-architect/

/resources/scripts/

Avoid changing URLs after publication.

---

# 13. Search

Search should index all public content.

Searchable content includes:

- Articles
- Lab Notes
- Tutorials
- Projects
- Architecture
- Technologies
- Certifications
- Downloads

Search should prioritize relevance over recency.

---

# 14. Content Growth Strategy

The architecture must support thousands of content items without restructuring.

Future content types should be additive rather than disruptive.

Maintain a stable navigation hierarchy while allowing the content library to expand indefinitely.

