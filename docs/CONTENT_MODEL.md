# Content Model

Version: 1.0

---

# 1. Philosophy

Every piece of information published on PTKP is a Knowledge Asset.

Knowledge Assets are first-class entities.

Each asset has its own identity, metadata, relationships, lifecycle, and discoverability.

Content is never considered "just a page."

---

# 2. Knowledge Asset Types

The platform supports the following primary asset types:

- Article
- Lab Note
- Tutorial
- Learning Path
- Architecture Guide
- Project
- Technology
- Certification
- Resource
- Download
- Presentation
- Case Study
- External Reference

Future asset types should extend this model rather than replacing it.

---

# 3. Common Metadata

Every asset must contain:

- Title
- Slug
- Description
- Summary
- Author
- Published Date
- Updated Date
- Status
- Tags
- Technologies
- Categories
- Difficulty
- Reading Time (where applicable)
- Related Assets
- Featured Image
- SEO Metadata

This metadata is mandatory unless explicitly exempted.

---

# 4. Lifecycle

Every Knowledge Asset follows a lifecycle:

Draft

↓

Review

↓

Published

↓

Updated

↓

Archived

Assets should never be deleted without reason.

Historical value is important.

---

# 5. Relationships

Knowledge Assets are interconnected.

Examples:

Article
→ Technology

Article
→ Project

Project
→ Architecture Guide

Architecture Guide
→ Technology

Technology
→ Certification

Certification
→ Learning Path

Learning Path
→ Articles

Lab Note
→ Technology

Case Study
→ Project

Downloads
→ Articles

Relationships should be represented explicitly in metadata wherever practical.

---

# 6. Articles

Purpose:

Evergreen technical documentation.

Avoid news-style content.

Structure:

Overview

Background

Problem

Solution

Implementation

Examples

References

Related Assets

---

# 7. Lab Notes

Purpose:

Quick reference.

Characteristics:

Very short.

One topic.

One solution.

Highly searchable.

Examples:

kubectl commands

systemctl

Terraform snippets

Git

Oracle SQL

Linux troubleshooting

---

# 8. Architecture Guides

Purpose:

Explain complete technical architectures.

Characteristics:

Long-form.

Diagram-heavy.

Business context included.

Production-focused.

---

# 9. Projects

Purpose:

Document real engineering implementations.

Every project should answer:

What problem existed?

Why this solution?

How was it implemented?

What challenges occurred?

What was learned?

---

# 10. Technology Pages

Technology pages are hubs.

They aggregate all related assets.

Technology pages should never duplicate documentation.

They organize existing knowledge.

---

# 11. Learning Paths

Learning Paths provide structured education.

Each path references multiple Articles, Projects, Lab Notes, and Architecture Guides.

Learning Paths define a recommended reading order.

---

# 12. Certifications

Certification pages contain:

Credential details

Verification

Related technologies

Related projects

Related articles

Study resources

Personal reflections (optional)

---

# 13. Resources

Resources include:

Scripts

Templates

Cheat Sheets

Configuration Files

Reference Documents

Downloads

Every resource should link back to related assets.

---

# 14. Case Studies

Case Studies focus on decision-making.

Structure:

Context

Requirements

Constraints

Decision

Implementation

Outcome

Lessons Learned

---

# 15. Future Assets

The model should allow additional asset types without breaking existing relationships.

Examples:

Conference Notes

Research Papers

Home Lab Experiments

Book Reviews

Video Tutorials

Infrastructure Patterns

Automation Recipes