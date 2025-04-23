# Morph — An opinionated AI essay editor

Morph is a fast, smart, and opinionated editor that seamlessly integrates into your workflow. It provides a slick, responsive interface for side-by-side comparisons to supercharge the multi-step editing process.


Leveraging Google’s Gemini API, morph has a list of predefined prompts to support grammar edit, lexical edit, logical edit, enabling modular edits based on users’ needs. Users can also provide their own prompts to tailor the AI to meet their needs.

## Features

Morph provides the following features:
- Apply **preconfigured prompts** for grammar, lexical, and logical edits.
- Use Customized prompts for personalized modifications.
- Display a **side-by-side comparison** of edits.
- Get **accessible and responsive layouts** and dark mode support.

## Tech stack

Here is a list of the tech stack used in this project:
- **Backend**: Next.js (App Router, Server Action)
- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Database**: MongoDB, Prisma
- **CI/CD**: Docker Compose, Husky, Github Actions, Vercel
- **LLM API**: Vercel AI SDK
- **Input validation**: Zod, React Hook Form
- **Security**: Bcrypt, Arcjet
- **Testing**: Playwright
- **Animation**: Framer Motion