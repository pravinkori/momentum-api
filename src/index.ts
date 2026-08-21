import app from "./server.ts";
import { env } from "../env.ts";

app.listen(env.PORT, env.HOST, () => {
  console.log(`\nServer running at http://${env.HOST}:${env.PORT}`);
  console.log(`Environment: ${env.APP_STAGE}`);
});
