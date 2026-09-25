# Aide backend learning — session handoff

**Purpose:** Preserve the interactive learning chat that lived under `helper-apps` after the repo rename to `aide`, so a new Cursor window/chat can continue without losing progress.

**Repo root now:** `/Users/muhammad-tahirsanuth/Desktop/Coding/aide`  
**Plan source of truth:** `learning_backend.plan.md`  
**Raw prior chat transcript (JSONL):** `.cursor/learning-handoff/backend-learning-chat.jsonl`  
**Prior Cursor transcript id:** `d2c935b9-f676-4abe-8381-787989028950`

**How to continue in a fresh chat:**  
`@learning_backend.plan.md` and `@.cursor/learning-handoff/SESSION_CONTEXT.md` — say: *continue Domain Step 1 (Task Zod schemas) from the handoff*.

**Teaching style the user wants:** interactive, step-by-step; explain why/how; cite official docs; thorough examples; **user handwrites code** (do not dump-implement unless asked).

---

## Progress snapshot (as of handoff)

### Done — HTTP fundamentals
1. Request/response message anatomy  
2. Methods + status codes (`201` vs `200`, `404` vs `403`, `400` vs `422`)  
3. Headers / JSON / `Content-Type` / `Accept`  
4. Cookies, origin, CORS (browser enforces; `*` incompatible with credentials)  
5. Env vars, async errors, full request path  

### Done — Express shell (`express-backend/`)
1. pnpm workspace package, TS, `createApp(config)` vs `server.ts`, `GET /health`  
2. Zod config (`PORT`, `NODE_ENV` as `dev|test|prod`, `CORS_ORIGIN`), Vitest + Supertest  
3. Request IDs (`X-Request-Id`), `AppError`, JSON error envelope, not-found → error handler  
4. CORS (`credentials: true`, specific origin), `express.json()`, `400` malformed JSON / `422` validation (echo route was a learning tool; may be removed)  
5. Graceful shutdown (`SIGINT`/`SIGTERM`, `server.close`, force `closeAllConnections`); note: `tsx watch` / `pnpm dev` force-kills and breaks the “drain in-flight” demo — use `pnpm start` for that demo  

**Plan todo `baseline-http`:** completed  

### In progress / next — Domain CRUD
**Next lesson assigned:** Domain Step 1 — Task (+ light Note) Zod schemas  
- Files to handwrite: `src/domain/tasks/schemas.ts`, `schemas.test.ts`, `src/domain/notes/schemas.ts`  
- Then: repository interface + in-memory impl → service (ownership) → thin routes → fake-user middleware  
- **After** domain exit criterion: Phase 2 Express session auth (added to plan)  
- **Later:** React → SQLite → editor → dictation → agent → evals → Hono + Better Auth  

**Auth path (user requested, added to plan):**  
- Domain: fake-user middleware for **authz** (`req.user` + ownership)  
- Phase 2: Express **authn** (sessions, hashed passwords, cookie flags) before React  
- Phase 10: Better Auth on Hono replaces Express sessions; keep `req.user` + ownership stable  

---

## Current Express architecture (learning app)

```text
express-backend/
  package.json          # name may still say express-backend-aide-app
  .env / .env.example   # PORT, NODE_ENV, CORS_ORIGIN
  vitest.config.ts
  src/
    config.ts           # loadConfig() + Zod; export Config
    server.ts           # dotenv, createApp, listen, graceful shutdown
    app/
      app.ts            # createApp(config)
      app.test.ts       # health, 404 envelope, CORS, (echo if still present)
      index.ts          # default export createApp
    middleware/
      request-id.ts     # requestIdSetter; Express.Request.requestId
      not-found.ts
      error-handler.ts  # AppError, SyntaxError→400, else 500; return if headersSent
    errors/
      app-errors.ts     # AppError(statusCode, code, message)
```

**Middleware order:** `requestId` → `cors` → `express.json` → routes → `notFound` → `errorHandler`  

**Error envelope:**
```json
{ "error": { "code": "...", "message": "...", "requestId": "..." } }
```

---

## Course outline (updated)

| # | Item | Status |
|---|---|---|
| HTTP 1–5 | Fundamentals | Done |
| Express 1–5 | Shell | Done |
| Domain 1 | Task/Note Zod schemas | **Next** |
| Domain 2–n | Repo → service → routes → fake-user | Pending |
| Phase 2 | Express session auth | Pending |
| Phase 3 | React + TanStack + credentials | Pending |
| Phase 4+ | SQLite → notes → dictation → agent → evals → Hono | Pending |

See `learning_backend.plan.md` for full phase text (includes Express auth phase and renumbered later phases).

---

## Important corrections burned into the chat

- Create resource → prefer **`201`**, not `200`  
- Missing resource → **`404`**; wrong owner → **`403`** (or `404` as privacy policy)  
- Valid JSON, bad domain data → **`422`**; not JSON → **`400`**  
- `server.close` does **not** kill in-flight; `closeAllConnections` does  
- Shutdown listeners are on **`process`**, ownership of listen/close is **`server.ts`**, not `createApp`  
- CORS is headers + browser; curl ignores it  

---

## Agent instructions if resuming

1. Do **not** re-teach HTTP/Express shell unless asked.  
2. Continue interactive Domain Step 1 (schemas) unless user says they already finished it.  
3. Keep handwriting-first; check answers; cite MDN/Express/Zod/Node docs.  
4. Prefer paths under `/Users/muhammad-tahirsanuth/Desktop/Coding/aide`.  
