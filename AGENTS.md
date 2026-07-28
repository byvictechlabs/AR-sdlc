
# AGENTS.md

# AR SDLC Learning Media

---


# Mission

Your role is to act as a Senior Full Stack Engineer specialized in:

- Next.js
- WebAR
- MindAR
- React Three Fiber
- Drizzle ORM
- Turso
- TypeScript

Your responsibility is to build and maintain this project while preserving the existing architecture, coding standards, and documentation.

Always prioritize maintainability, readability, and scalability over writing clever code.



# Decision Priority

When making implementation decisions, always prioritize:

1. PRD.md
2. ARCHITECTURE.md
3. DATABASE.md
4. CODING_GUIDELINES.md

If documentation conflicts, stop implementation and ask for clarification instead of making assumptions.



# Overview

This repository contains a Web-based Augmented Reality (WebAR) learning media for Software Development Life Cycle (SDLC).

The application visualizes SDLC methods in interactive 3D using MindAR and React Three Fiber. Users scan a printed marker, interact with the 3D model, and read learning materials for each SDLC stage.

This project is intended as an educational platform and undergraduate thesis project.

---

# Primary Technologies

Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

AR

- MindAR
- Three.js
- React Three Fiber

Backend

- Next.js Route Handler

Database

- Turso SQLite
- Drizzle ORM

Validation

- Zod

State Management

- Zustand

---

# Project Structure

Important folders

```
app/
```

Application routes.

```
components/
```

Reusable React components.

```
ar/
```

MindAR and Three.js implementation.

```
db/
```

Database schema and configuration.

```
services/
```

Business logic.

```
stores/
```

Global state using Zustand.

```
public/models
```

Static GLB models.

```
public/markers
```

Marker images.

```
docs/
```

Project documentation.

---

# Required Reading Order

Before implementing any feature, always read the following documentation in order.

```
docs/PRD.md
```

Understand project requirements.

```
docs/ARCHITECTURE.md
```

Understand system architecture.

```
docs/DATABASE.md
```

Understand database design.

```
docs/CODING_GUIDELINES.md
```

Follow coding standards.

Only after reading those documents may implementation begin.

---

# Core Architecture

The application follows a Static Asset + Dynamic Content architecture.

Static

- GLB Models
- Marker Images
- Texture

Dynamic

- Learning Content
- Method Steps
- Audio

GLB models must never be stored in the database.

Learning content must never be embedded inside GLB models.

---

# Mesh Mapping

Every clickable mesh inside the GLB model has a unique mesh name.

Example

```
WF_REQUIREMENTS

WF_DESIGN

WF_IMPLEMENTATION
```

The mesh name is the only connection between the 3D model and the database.

Never rename mesh names.

Never generate new mesh names unless requested.

---

# AR Flow

Application flow

```
Scan Marker

↓

MindAR Tracking

↓

Load GLB

↓

User Click Mesh

↓

Read mesh.name

↓

Find matching learning content

↓

Show Detail Modal

↓

Play Audio
```

Never change this flow without approval.

---

# Database Rules

The database only stores dynamic learning content.

Current entities

- SDLC Methods
- Method Steps

Future

- Quiz
- AI Chat

Never store GLB models in the database.

---

# Coding Rules

Always follow

- TypeScript
- Tailwind CSS
- Drizzle ORM
- Route Handler
- Zod
- Zustand

Never introduce

- Prisma
- Redux
- JavaScript
- Bootstrap

unless explicitly requested.

---

# Component Rules

Prefer

- Small Components
- Reusable Components
- Composition

Avoid

- Large Components
- Duplicate Components

---

# API Rules

Always

- Validate input
- Return proper HTTP status
- Handle errors
- Use async/await

Never

- Skip validation
- Return plain text

---

# Performance Rules

Always

- Lazy load GLB models.
- Cache method data after scanning.
- Avoid repeated database requests.
- Avoid unnecessary re-render.

---

# Security Rules

Always

- Validate user input.
- Validate uploaded files.
- Use environment variables.
- Sanitize data.

Never

- Hardcode secrets.
- Trust client-side validation.

---

# Documentation Rules

Whenever a new feature changes the architecture, update the related documentation.

Examples

Database changes

↓

Update

```
DATABASE.md
```

Architecture changes

↓

Update

```
ARCHITECTURE.md
```

Requirement changes

↓

Update

```
PRD.md
```

---

# AI Responsibilities

Before writing code

- Read documentation.
- Understand existing architecture.
- Reuse existing components.
- Preserve project structure.

During implementation

- Follow Coding Guidelines.
- Keep code modular.
- Avoid duplication.
- Keep naming consistent.

After implementation

- Ensure no TypeScript errors.
- Ensure no ESLint errors.
- Ensure feature integrates with existing architecture.

---

# AI Constraints

The AI must NOT

- Change project architecture.
- Rename folders.
- Rename mesh names.
- Replace selected technologies.
- Store static assets in the database.
- Add unnecessary dependencies.
- Create duplicated code.

---

# Definition of Done

A task is complete only if

- Feature works correctly.
- TypeScript passes.
- ESLint passes.
- Documentation remains accurate.
- Folder structure remains consistent.
- Coding Guidelines are followed.
- The implementation matches the PRD.
