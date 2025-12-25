import { app } from "./server.ts";
import { env } from "../env.ts";

const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(env.PORT, () => {
  console.log(`server running on port http://localhost:${env.PORT}`);
  console.log(`Environment: ${env.APP_STAGE}`);
});
