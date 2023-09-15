import express from "express";
import {
  getOfflineConversionsAction,
  registerConversionAction,
} from "./actions.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Register Conversion
app.post("/offline-conversion/:id", registerConversionAction);

// Get Offline Conversions from User
app.get("/offline-conversions/:id", getOfflineConversionsAction);

app.listen(port);
