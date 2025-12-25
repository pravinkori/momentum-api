import { app } from "./server.ts";

const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
  console.log(`server running on port http://localhost:${port}`);
});
