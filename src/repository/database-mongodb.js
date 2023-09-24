import "dotenv/config";
import mongoose from "mongoose";
import { logger } from "../logger.js";

export class DataBaseMongoDB {
  conversion;

  constructor() {
    this.configure();
  }

  async configure() {
    mongoose.connect(process.env.MONGODB_URL);

    mongoose.connection.on("error", (error) => {
      logger.log("error", "Error connecting to database", error);
    });

    mongoose.connection.once("open", () => {
      logger.log("info", "Connected to MongoDB database successfully");
    });

    const conversionsSchema = new mongoose.Schema({
      uniqueId: String,
      search: String,
      baseUrl: String,
      referrer: String,
      createdAt: { type: Date, default: Date.now },
    });

    this.conversion = mongoose.model("Conversions", conversionsSchema);
  }

  async saveOfflineConversion(uniqueId, conversion) {
    const { search, baseUrl, referrer } = conversion;

    // Save conversion in database
    this.conversion.create({
      uniqueId,
      search,
      baseUrl,
      referrer,
    });
  }

  async getOfflineConversions(uniqueId) {
    // Get conversions from database
    const conversions = await this.conversion.find({ uniqueId });

    return conversions;
  }
}
