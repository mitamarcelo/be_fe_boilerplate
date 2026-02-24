# Clean Architecture Express API (TypeScript)

This project is a backend starter built with Node.js + TypeScript + Express, following a feature-first clean architecture.

## How to use

1. Install prerequisites:
   - Node.js `>=20`
   - npm
2. Install dependencies:
   - `npm install`
3. Create your local env file:
   - `cp .env.example .env`
4. Configure `.env` values:
   - `PORT=3000`
   - `NODE_ENV=development`
   - `JWT_SECRET=<your-secret>`
   - `JWT_EXPIRES_IN=1h`
   - Optional DB variable for persistence setups: `DATABASE_URL=postgresql://user:password@localhost:5432/your_db`
5. Start the API in development mode:
   - `npm run dev`
6. Verify the server:
   - Open `http://localhost:3000/api/v1/health`

### Important DB note

This starter currently uses an in-memory user repository (`src/features/auth/infrastructure/repositories/in-memory-user-repository.ts`), so data is reset whenever the server restarts.
If you switch to a real database repository, keep `DATABASE_URL` in `.env` and wire that repository in `src/main/app.ts`.

## Scripts

- `npm run dev` starts the API in watch mode.
- `npm run build` compiles TypeScript to `dist/`.
- `npm run start` runs compiled output.
- `npm run test` executes Jest tests.
- `npm run lint` runs ESLint.

## API

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token required)

## Why this folder structure

- Features are isolated (`features/auth`, `features/health`) so modules scale independently.
- Each feature contains layers (`domain`, `application`, `infrastructure`, `presentation`) which enforces clear dependency direction.
- Framework code is confined to `main/` and `presentation/`, keeping business logic portable and testable.
- Ports in the application layer make infra easy to replace later (for example, in-memory repository to Postgres).

## Structure

```text
src/
  main/
  shared/
  features/
  tests/
```
