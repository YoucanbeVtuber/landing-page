# landing-page Agent Bootstrap

`landing-page` is the marketing and landing UI repository in the YoucanbeVtuber workspace.

Read in this order before making changes:

1. `README.md`
2. `../agent-docs/README.md`
3. `package.json`

## Local Rules

- Use the workspace Docker runtime for installs, builds, tests, and dev-server commands.
- Treat this repository as a Next.js application and keep framework conventions intact.
- Prefer changes that preserve existing app behavior unless the task explicitly calls for copy or UI updates.
- Keep dependency changes scoped and avoid incidental package churn.
- When editing UI, verify that desktop and mobile behavior still make sense.

## Context Boundary

- Workspace-level rules live in `../agent-docs/`.
- Repository-local implementation context should be documented in this repo as the project grows.
