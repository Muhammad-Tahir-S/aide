import "dotenv/config";

import { app } from "./app/app";
import { loadConfig } from "./config";

const { PORT, NODE_ENV, CORS_ORIGIN } = loadConfig();

const server = app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`env=${NODE_ENV} cors=${CORS_ORIGIN}`);
});
