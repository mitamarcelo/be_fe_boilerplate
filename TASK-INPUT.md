# TASK INPUT (Authoritative)

This file is the ONLY source of truth for task intent.
No interpretation, expansion, or inference is allowed.

- Task name:
Setup authentication flow

- Task description:
Setup authentication flow for the frontend project.

The authentication will use the backend api from "signup" and "login" pages

The authenticated user will be stored on a new store using redux toolkit. I want the store folder to have the structure:

|- store/
    |- Auth
        |- slice.ts
        |- selectors.ts
        |- reducers.ts
    |- index.ts

I also want the token to be stored in the session storage when user perform a login and retreived from it when the app reloads (or reopens on a new tab).

To perform the api requests, use TankStack and plain `fetch`.

- Primary users (optional):
users that wants to register, login and logout from my web app.

- Known constraints:
    - The user must be able to register on one page and login on another.
    - The custom components that needs to be created must come from @src/components using the structure pattern that is present on @src/components/ExampleComponent

- Known non-goals (optional):
No need to create separation between authenticated/unauthenticated pages yet. 

- Known data / APIs / types (optional):
The api to be used is present on the backend folder. Setup TankStank to have a baseUrl to this api. It's garantee that it will be running when starting this app. 

- Task slug:
setup-authentication-flow

<!-- AUTHORING RULES:
- This file is written by a human.
- The assistant must treat all values as literal.
- Missing fields mean "unknown", not "inferable".
-->
