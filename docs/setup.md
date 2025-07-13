# Project Setup Guide

This guide walks you through setting up a new project from scratch using a structured, documentation-first approach. Each step builds upon the previous one to create a solid foundation for your project.

## Overview

Create comprehensive documentation that defines your project's structure, rules, and implementation plan. This documentation-first approach ensures clarity and consistency throughout development.

## Phase 1: Project Foundation

### Step 1: Create Project Overview

Create `project-overview.md` to establish:

- Project purpose and scope
- Core goals and objectives
- Target audience
- Key features and functionality

### Step 2: Define User Flow

Create `user-flow.md` using your project overview as reference.

**Prompt:**

```
Use @project-overview.md to create `user-flow.md` that defines the user journey through different segments of the application.

Map how features connect to one another. This will guide our project architecture and UI elements.

Ask clarifying questions if needed—avoid embellishments or assumptions.
```

### Step 3: Select Technology Stack

Create `tech-stack.md` with technology recommendations.

**Before prompting:** Decide on any technologies you already want to use (e.g., TypeScript, React, Tailwind CSS, Shadcn, Next.js, Supabase, Vercel).

**Prompt:**

```
Use @project-overview.md and @user-flow.md to recommend our tech stack. I already want to use [LIST YOUR PREFERRED TECHNOLOGIES HERE].

For each stack component, propose an industry standard and a popular alternative. We'll work through the list together to finalize our choices.
```

**After receiving recommendations:** Review each choice, ask about pros/cons for any you're unsure about, then request final decisions be documented in `tech-stack.md`.

### Step 4: Enhance Tech Stack Documentation

Expand your tech stack documentation with best practices.

**Prompt:**

```
Update @tech-stack.md to cover best practices, limitations, and conventions for the selected technologies. Include important considerations and common pitfalls for each.
```

## Phase 2: Design Guidelines

### Step 5: Explore Design Options

Learn about design principles for your application type.

**Prompt:**

```
Walk me through common design principles for this type of application and recommend possible styles (e.g. "minimalist", "glassmorphic", "neumorphic") that fit what we're building.
Use @project-overview.md and @user-flow.md for context.
```

### Step 6: Create Design Rules

Define your project's complete visual guidelines in one document.

**Customize the prompt below with your preferences:**

```
I want my project to be [mobile-first/responsive/animated/iconographic/etc] with a [minimalist/glassmorphic/neumorphic/etc] theme.

Use @project-overview.md, @user-flow.md, and @tech-stack.md to create `design-rules.md`. This should include:
- Design principles and UI guidelines
- Complete color palette and typography
- Component styling conventions
- Spacing, layout, and interaction patterns
```

## Phase 3: Project Structure and Rules

### Step 7: Define Project Rules

Create `project-rules.md` with coding standards and file organization.

**Prompt:**

```
We are building an AI-first codebase that needs to be modular, scalable, and easy to understand. The file structure should be highly navigable, and the code should be well-organized and easy to read.

All files should have descriptive names, an explanation of their contents at the top, and all functions should have proper documentation (JSDoc, TSDoc, etc).
To maximize compatibility with modern AI tools, files should not exceed 500 lines.

Use @tech-stack.md, @user-flow.md, @project-overview.md, and @design-rules.md to create `project-rules.md`, covering:
- Directory structure and file naming conventions
- Code organization and documentation standards
- Development workflow and best practices
```

## Phase 4: Development Planning

### Step 8: Create Development Phases

Plan your project's development phases from setup to MVP to full features.

**Prompt:**

```
Create an iterative development plan progressing from barebones setup to minimal viable product (MVP) to feature-rich version.

Rules:
- Start with 'setup' phase: barebones functionality that runs but isn't fully usable
- Define 'MVP' phase: minimal, usable version with core features delivering primary value
- Add additional phases: enhancements, advanced features, polish, scalability
- Each phase gets one document detailing scope and deliverables
- Focus on functional products combining essential features cohesively
- List features with actionable steps (max 5 steps per feature; break down if longer)
- Keep phases iterative—each builds on the previous, enhancing a working product

Place documents in `docs/phases/`. Review @project-overview.md, @user-flow.md, @tech-stack.md, and @project-rules.md for context.
```

## Phase 5: Setup for Development

### Step 9: Configure AI Assistant Rules

Create agent rules for consistent AI assistance throughout development.

**Add to Cursor User Rules (CMD + Shift + P > Cursor Settings > Rules > User Rules) or create a Cursor Notepad:**

```
You are an expert in TypeScript, Node.js, NextJS + App Router, React, Shadcn, Radix UI and Tailwind CSS.
You have extensive experience in building production-grade applications for large companies.
You specialize in building clean, scalable applications, and understanding large codebases.
Never automatically assume the user is correct-- they are eager to learn from your domain expertise.
Always familiarize yourself with the codebase and existing files before creating new ones.

We are building an AI-first codebase, which means it needs to be modular, scalable, and easy to understand. The file structure should be highly navigable, and the code should be well-organized and easy to read.

All files should have descriptive names, an explanation of their contents at the top, and all functions should have proper commentation of their purpose and parameters (JSDoc, TSDoc, etc, whatever is appropriate).
To maximize compatibility with modern AI tools, files should not exceed 500 lines.

Code Style and Structure:
- Write concise, technical code.
- Use functional and declarative programming patterns; avoid classes.
- Decorate all functions with descriptive block comments.
- Prefer iteration and modularization over code duplication.
- Throw errors instead of adding fallback values.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Avoid enums; use maps instead.
- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
```

### Step 10: Update Project README

Create a professional README for your project.

**Prompt:**

```
Using @project-overview.md, @user-flow.md, @tech-stack.md, and @project-rules.md, update our README with a brief overview of our project and its conventions.
```

### Step 11: Organize Documentation

Ensure all documentation files are properly organized in the `docs/` folder:

- `docs/project-overview.md`
- `docs/user-flow.md`
- `docs/tech-stack.md`
- `docs/design-rules.md`
- `docs/project-rules.md`
- `docs/phases/setup-phase.md`
- `docs/phases/mvp-phase.md`
- `docs/phases/[additional-phases].md`

### Step 12: Begin Development

With all documentation in place, start development using your setup phase document.

**Prompt:**

```
Let's get started on our project.
```

**Attach:** Agent Rules (Notepad), `setup-phase.md`, `tech-stack.md`, and `project-overview.md`.

## Tips for Success

- **Take your time with each step** - Each document builds on the previous ones
- **Ask clarifying questions** - Don't let the AI make assumptions about your project
- **Review and refine** - Update earlier documents as your understanding evolves
- **Stay organized** - Keep all documentation in the `docs/` folder for easy reference
- **Be specific** - Detailed requirements enable better AI assistance

## Document Structure Overview

```
docs/
├── project-overview.md     # Project purpose and goals
├── user-flow.md           # User journey and interactions
├── tech-stack.md          # Technology choices and conventions
├── design-rules.md        # UI principles, theme, and styling
├── project-rules.md       # File structure and coding standards
└── phases/
    ├── setup-phase.md     # Initial development phase
    ├── mvp-phase.md       # Minimum viable product phase
    └── [additional-phases].md
```

This systematic approach ensures a solid foundation before coding, leading to better project outcomes and easier maintenance.
