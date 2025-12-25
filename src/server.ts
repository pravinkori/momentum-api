import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Habit Tracker API",
  });
});

// Named export for use in other modules (like tests)
export { app };

export default app;
