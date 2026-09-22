import "dotenv/config";

import createApp from "./app";
import { loadConfig } from "./config";

const config = loadConfig();
const { PORT, NODE_ENV, CORS_ORIGIN } = config;
const app = createApp(config);

const server = app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`env=${NODE_ENV} cors=${CORS_ORIGIN}`);
});

const SHUTDOWN_MS = 10_000;
let shuttingDown = false;

function shutdown(signal: string) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  console.log({ msg: "shutdown_started", signal });

  const forceTimer = setTimeout(() => {
    console.error({ msg: "shutdown_forced", afterMs: SHUTDOWN_MS });
    // Node 18+: closes every connection still open
    server.closeAllConnections();
  }, SHUTDOWN_MS);
  forceTimer.unref(); // don't keep the process alive only for this

  server.close((err) => {
    if (err) {
      console.error({ msg: "shutdown_error", err });
      process.exit(1);
    }
    console.log({ msg: "shutdown_complete" });
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
