import app from "./app";
import database from './config/db-connexion';


const PORT = Number(process.env.EXPRESS_PORT) || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express server started on port ${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(() => {
    database.end((err) => {
      if (err) {
        console.error("Failed to close database pool:", err);
        process.exit(1);
      }

      console.log("Database connection pool closed");
      console.log("HTTP server stopped");

      process.exit(0);
    });
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

