# Aide

This monorepo contains the frontend and backend services for a suite of collaborative applications, including a Task Manager and a Notes app. It's configured with pnpm workspaces, TypeScript, and a full suite of development tools to ensure code quality and consistency.

## Monorepo Structure

The repository is organized as follows:

- `frontend/`: A React-based application built with Vite, serving as the user interface for all applications.
- `services/`: Contains all backend services, including the API server and real-time collaboration services.
- `packages/`: Intended for shared libraries or components, though currently unused.

## Prerequisites

- Node.js (v20.11.1 or higher)
- pnpm (v9.0.0 or higher)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/aide.git
    cd aide
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

## How to Run Each Workspace

### Frontend

To run the frontend application in development mode:

```bash
pnpm dev:frontend
```

This command starts the Vite development server for the React application.

### Backend

The backend consists of two services that must be run concurrently.

- **API Server**:

  ```bash
  pnpm dev:api
  ```

- **PartyKit Server** (for real-time collaboration):

  ```bash
  pnpm dev:party
  ```

To run all development servers simultaneously, use the root `dev` script:

```bash
pnpm dev
```

## Important Scripts

### Root `package.json`

- `dev`: Starts all development servers concurrently.
- `build`: Builds all packages (excluding the PartyKit server).
- `lint`: Lints the entire monorepo using ESLint.
- `format`: Formats all files with Prettier.
- `typecheck`: Runs TypeScript type-checking across all packages.
- `db:generate`: Generates database migration files using Drizzle Kit.
- `db:migrate`: Applies database migrations.
- `db:studio`: Opens Drizzle Studio to manage the database.

### `frontend/package.json`

- `dev`: Starts the Vite development server.
- `build`: Compiles TypeScript and builds the frontend application.
- `lint`: Lints the frontend codebase.
- `preview`: Serves the production build locally.
- `shadcn-add`: Adds a new `shadcn/ui` component to the project.

## Generating `shadcn/ui` Components

To add a new `shadcn/ui` component, run the following command from the `frontend` directory:

```bash
pnpm shadcn-add [component-name]
```

Replace `[component-name]` with the name of the component you wish to add (e.g., `button`, `card`).

## Linting and Formatting

This monorepo uses ESLint for linting and Prettier for code formatting. Configuration files are located at the root and in the `frontend` directory.

- **ESLint**: Enforces consistent coding styles and identifies potential issues. The rules are defined in `eslint.config.js`.
- **Prettier**: Automatically formats code to maintain a consistent style.

To lint and format the codebase, run:

```bash
pnpm lint
pnpm format
```

## Pre-Commit Hook

This project uses `husky` and `lint-staged` to enforce code quality with a pre-commit hook.

- **`husky`**: Manages Git hooks.
- **`lint-staged`**: Runs linters on staged files.

Before each commit, the hook automatically runs `eslint --fix` on all staged TypeScript and JavaScript files, and performs a type check on TypeScript files. This has the following consequences:

1.  **Automated Code Formatting**: Your code is automatically formatted and linted before it enters the codebase.
2.  **Type-Safety Checks**: TypeScript files are checked for type errors before they can be committed.
3.  **Commit Rejection**: If ESLint finds errors that it cannot automatically fix, or if the type-check fails, the commit will be aborted. You must manually fix the errors before you can commit your changes.

This ensures that all code in the repository adheres to the established style and type-safety guidelines, improving overall code quality and consistency.
