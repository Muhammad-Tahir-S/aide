# Aide backend learning — session handoff

**Purpose:** Preserve the interactive learning chat that lived under `helper-apps` after the repo rename to `aide`, so a new Cursor window/chat can continue without losing progress.

**Repo root now:** `/Users/muhammad-tahirsanuth/Desktop/Coding/aide`  
**Plan source of truth:** `learning_backend.plan.md`  
**Raw prior chat transcript (JSONL):** `.cursor/learning-handoff/backend-learning-chat.jsonl`  
**Prior Cursor transcript id:** `d2c935b9-f676-4abe-8381-787989028950`

**How to continue in a fresh chat:**  
`@learning_backend.plan.md` and `@.cursor/learning-handoff/SESSION_CONTEXT.md` — say: *continue from the handoff; pick a next step from the options at the bottom*.

**Teaching style the user wants:** interactive, step-by-step; explain why/how; cite official docs; thorough examples; **user handwrites code** (do not dump-implement unless asked).

**Last progress update:** 2026-09-29

---

## Progress snapshot

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
4. CORS (`credentials: true`, specific origin), `express.json()`, malformed JSON → `400`  
5. Graceful shutdown (`SIGINT`/`SIGTERM`, `server.close`, force `closeAllConnections`); note: `tsx watch` / `pnpm dev` force-kills and breaks the “drain in-flight” demo — use `pnpm start` for that demo  

**Plan todo `baseline-http`:** completed  

### Done — Domain tasks (Steps 1–4)
1. **Zod schemas** — `Task` entity, create/update/list query; statuses `todo | in-progress | completed`; `dueDate`; optimistic `version`  
2. **Repository** — `TaskRepository` interface + in-memory Map (`createTaskRepository`); clone on write; filter by `ownerId` / `parentTaskId` / `status`  
3. **Service** — `createTaskService(repo)`; `Actor`; defaults; ownership; parent ownership for subtasks; version conflict → `409 TASK_VERSION_CONFLICT`; foreign/missing → `404 TASK_NOT_FOUND`  
4. **HTTP** — `fakeUser` (`X-User-Id`) global; `requireUser` on `/api/tasks`; thin `tasksRouter`; `createApp(config, deps?)` injects repo for tests  
5. **Tests** — schema, memory repo, service, route Supertest (401, 201, 422, cross-user 404, complete + version, 409 stale)  

**Checkpoint locked in (2026-09-29):**  
- `fakeUser` global (attach identity when present); `requireUser` only on routes that need auth  
- `ownerId` set by **server** from actor, never from client body  
- Replacing `X-User-Id` with a session cookie keeps the same `Actor` → service ownership flow  

### In progress — Plan todo `domain-crud`
Exit criterion still needs:
- [ ] Explicit subtask **reorder** (if not only `position` on PATCH) — confirm coverage  
- [ ] **Note** create/update API + service + repo + tests (note schema stub exists)  
- [ ] Full checklist: parent + subtasks + complete + note + invalid input + cross-user (tasks side largely done)  

**Plan todo `domain-crud`:** in progress (tasks API up; notes + polish remain)  

### Not started (next phases)
- Phase 2 — Express session auth (`express-auth`)  
- Phase 3 — React + TanStack  
- Phase 4+ — SQLite → editor → dictation → agent → evals → Hono + Better Auth  

**Auth path (unchanged):**  
- Now: fake-user **authz** (`req.user` + ownership)  
- Next auth phase: Express **authn** (sessions, hashed passwords, cookies) before React  
- Later: Better Auth on Hono; keep `req.user` / `Actor` + ownership stable  

---

## Current Express architecture (learning app)

```text
express-backend/src/
  config.ts
  server.ts                    # listen + graceful shutdown
  app/app.ts                   # createApp(config, deps?)
  errors/app-errors.ts
  middleware/
    request-id.ts
    fake-user.ts               # X-User-Id → req.user
    require-user.ts            # 401 if no user
    not-found.ts
    error-handler.ts
  domain/
    auth/types.ts              # Actor { id }
    tasks/
      schemas.ts / schemas.test.ts
      types.ts                 # Task, inputs, TaskRepository
      memory-repository.ts
      memory-repository-test.ts
      service.ts / service.test.ts
    notes/schema.ts            # light stub only
  routes/
    tasks.ts / tasks.test.ts
```

**Middleware order:** `requestId` → `cors` → `json` → `fakeUser` → routes → `notFound` → `errorHandler`  

**Error envelope:**
```json
{ "error": { "code": "...", "message": "...", "requestId": "..." } }
```

**Privacy policy in use:** other user's task → `404 TASK_NOT_FOUND` (same as missing). `403` deferred.

---

## Course outline (status)

| # | Item | Status |
|---|---|---|
| HTTP 1–5 | Fundamentals | Done |
| Express 1–5 | Shell | Done |
| Domain 1 | Task/Note Zod schemas | Done (notes light) |
| Domain 2 | Task repository (memory) | Done |
| Domain 3 | Task service + ownership | Done |
| Domain 4 | Fake user + `/api/tasks` routes | Done |
| Domain 5+ | Notes CRUD / subtask reorder polish | **Decide next** |
| Phase 2 | Express session auth | Pending |
| Phase 3 | React + TanStack + credentials | Pending |
| Phase 4+ | SQLite → notes editor → … → Hono | Pending |

---

## Important corrections burned into the chat

- Create resource → prefer **`201`**, not `200`  
- Missing / non-owned (current policy) → **`404`**; optional later **`403`** for authenticated-but-forbidden  
- Valid JSON, bad domain data → **`422`**; not JSON → **`400`**  
- Stale optimistic lock → **`409`**  
- `server.close` does **not** kill in-flight; `closeAllConnections` does  
- Shutdown listeners on **`process`**; listen/close in **`server.ts`**  
- CORS is headers + browser; curl ignores it  
- `dueDate`: entity `.nullable()` (always present); PATCH `.nullable().optional()`  
- List filter: `parentTaskId: null` ≠ omit field  

---

## Possible next steps (user chooses)

1. **Notes CRUD** — same pattern as tasks (schemas polish → memory repo → service → `/api/notes` + tests). Closest to finishing `domain-crud`.  
2. **Subtask polish** — list-by-parent, reorder/`position` tests, maybe delete rules for parents with children.  
3. **Phase 2 Express auth** — start sessions early (domain exit not fully met; tasks authz already solid).  
4. **Structured logging (pino)** — optional shell polish before more domain.  
5. **Pause / review** — walk request path create-task end-to-end from curl to Map.  

---

## Agent instructions if resuming

1. Do **not** re-teach HTTP/Express shell or Task Steps 1–4 unless asked.  
2. Ask the user which next step (1–5 above) they want, or follow their explicit choice.  
3. Keep handwriting-first; check answers; cite MDN/Express/Zod/Node/OWASP docs.  
4. Prefer paths under `/Users/muhammad-tahirsanuth/Desktop/Coding/aide`.  
5. Keep `Actor` / `req.user` stable when introducing real auth later.  
