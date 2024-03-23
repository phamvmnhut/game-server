import express, { urlencoded, json } from "express";
import { join } from "path";

import morgan from "morgan";
import cors from "cors";
// const qs = require('qs');
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";

import route from "./api/index.js";
// TOTO: insert router
// const docsRouter = require('./routes/docsRouter');

import AppError from "./utils/appError.js";
import globalErrorHandler from "./utils/errorHandler.js";
import { Code } from "./utils/statusCode.js";

const app = express();

app.use(urlencoded({ extended: false }));

// Set security HTTP headers
app.use(helmet());
app.use(cors());

// Limit requests from same API
if (process.env.NODE_ENV !== "development") {
  const limiter = rateLimit({
    max: 70,
    windowMs: 15 * 60 * 1000,
    handler(request, response, next) {
      next(new AppError("Too many requests, please try again later!", 421));
    },
  });

  app.use("/api/", limiter);
}

// build-in middleware to get req.body ~ req.query from body
app.use(json({ limit: "20kb" }));

// Data Sanitization against:
app.use(xss()); // XSS
app.use(
  hpp({
    whitelist: ["duration"],
  })
); // parameter pollution

// Serving static files
app.use(express.static(join("__dirname", "public")));

// middleware to show log on console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      skip(req, res) {
        return res.statusCode < 400;
      }, // only log error responses
    })
  );
}

// 2 ROUTES
app.use("/api/v1/", route);
// TODO: use route here
// app.use('/api/v1/api-docs', docsRouter);

app.all("*", (request, response, next) => {
  next(new AppError(Code.NOT_FOUND.code));
});

app.use(globalErrorHandler);

import { Server } from "http";
const server = Server(app);

import { init } from "./socket/socket.js";
init(server);

export default server;
