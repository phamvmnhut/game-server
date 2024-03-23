// connect environment variable config.env file
import { config } from "dotenv";
config({ path: "./.env" });

// exit with code 1 -> shutdown |
// if it's default is exit with code 0 and have 2 paramater error and origin
process.on("uncaughtException", (error) => {
  console.log("UNCAUGHT EXCEPTION Shutting down...");
  console.log(error);
  process.exit(1);
});

import app from "./app.js";

// run server at port
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`The server is running in port ${port}`);
});

// Unhandled promise rejections ,close server and shutdown with exit code 1
process.on("unhandledRejection", (error) => {
  console.log(error);
  console.log("Unhandled promise rejections Shutting down...");

  // shutdown gracefully with first close the server, and then shutdown the application
  // server.close give server time to finish all the requests before shutdown the app
  server.close(() => {
    process.exit(1);
  });
});
