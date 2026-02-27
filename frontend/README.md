# React + TypeScript + Vite Frontend

This is the frontend starter for the boilerplate repo. It is set up for a modern React app with routing, state management, data fetching, and a UI component library.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- TanStack Query
- Material UI + Emotion
- ESLint

## How to use

1. Install prerequisites:
   - Node.js `>=20`
   - npm
2. Install dependencies:
   - `npm install`
3. Create your local env file:
   - `cp .env.example .env`
4. Update API base URL if needed:
   - `VITE_API_BASE_URL=http://localhost:3000`
5. Make sure that the backend is configured and running on PORT 3000.
6. Start the dev server:
   - `npm run dev`
7. Open the app:
   - `http://localhost:5173`

## Scripts

- `npm run dev` starts the Vite dev server.
- `npm run build` creates a production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.

## Structure

```text
src/
  app/
  features/
  shared/
```
