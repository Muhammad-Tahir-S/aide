# Aide backend learning — session handoff

**Purpose:** Preserve the interactive learning chat after the repo rename to `aide`.

**Repo root:** `/Users/muhammad-tahirsanuth/Desktop/Coding/aide`  
**Plan:** `learning_backend.plan.md`  
**Transcript JSONL:** `.cursor/learning-handoff/backend-learning-chat.jsonl`

**Teaching style:** interactive, step-by-step; why/how; official docs; **user handwrites** (no dump-implement unless asked).

**Last progress update:** 2026-09-30 (query-string list fix + plan reorder)

---

## Progress snapshot

### Done
- HTTP fundamentals + Express shell (`baseline-http`)
- **Task APIs** (`task-apis`): schemas, memory repo, service, fake-user, `/api/tasks` CRUD
- Manual live matrix + multi-user story (2026-09-30)
- **List query-string fix:** `req.query` + `parentTaskId=null` preprocess; Vitest + live curl verified

### In progress
- **Express session auth** (`express-auth`) — foundations assigned (SESSION_SECRET, argon2, user schemas, Actor + email)

### Deferred until after FE handoff
- **Notes CRUD** (`notes-crud`) — not before auth + task APIs are browser-proven

### Sequence (updated)
```text
1. Task APIs ✅
2. Express session auth  ← now
3. Frontend handoff (you connect React; not a guided FE chapter)
4. Notes CRUD (backend resumes)
5. SQLite → editor → dictation → agent → Hono …
```

---

## List API contract (for frontend)

```http
GET /api/tasks?status=todo&limit=20&offset=0
GET /api/tasks?parentTaskId=null          # top-level only
GET /api/tasks?parentTaskId=<uuid>        # children of parent
Header: X-User-Id: <id>                   # until sessions replace this
```

---

## Current architecture

```text
express-backend/src/
  config.ts, server.ts, app/app.ts
  middleware/ request-id, fake-user, require-user, not-found, error-handler
  domain/auth/types.ts          # Actor { id } — expand with email in auth phase
  domain/tasks/ schemas, types, memory-repository, service, routes
  domain/notes/schema.ts        # stub only
```

**Middleware:** requestId → cors → json → fakeUser → routes → notFound → errorHandler  
**Cross-user policy:** `404 TASK_NOT_FOUND`

---

## Agent instructions if resuming

1. Continue **Express session auth** (Step 1 foundations → user repo → AuthService → session middleware → wire tasks).  
2. Do **not** start notes CRUD until auth exit criterion + learner confirms FE handoff (or asks to defer FE).  
3. Handwriting-first; paths under `/Users/muhammad-tahirsanuth/Desktop/Coding/aide`.  
