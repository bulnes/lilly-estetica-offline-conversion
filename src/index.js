import express from "express";
import {
  getOfflineConversionsAction,
  registerConversionAction,
} from "./actions.js";
import { logger } from "./logger.js";

const app = express();

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV !== "development";
const allowedOrigins = isProduction
  ? [
      "https://lilly-estetica-poc.vercel.app",
      "https://www.lillyestetica.com.br",
    ]
  : [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:8080",
    ];

app.use(express.json());

// Enbale CORS
app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

// Register Conversion
app.post("/offline-conversion/:id", registerConversionAction);

// Get Offline Conversions from User
app.get("/offline-conversions/:id", getOfflineConversionsAction);

app.listen(port, () => logger.log("info", `App listening on port ${port}!`));
