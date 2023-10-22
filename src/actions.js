import { logger } from "./logger.js";
import { DataBaseMemory } from "./repository/database-memory.js";
import { DataBaseMongoDB } from "./repository/database-mongodb.js";

const isProduction = process.env.NODE_ENV !== "development";
const database = isProduction ? new DataBaseMongoDB() : new DataBaseMemory();

// Register Conversion
export const registerConversionAction = async (req, res) => {
  const { id } = req.params;
  const { search, baseUrl, referrer, clientId, sessionId } = req.body;

  logger.log("info", `Registering conversion for user ${id}`);

  try {
    await database.saveOfflineConversion(id, {
      search,
      baseUrl,
      referrer,
      clientId,
      sessionId,
    });

    logger.log("info", `Conversion registered for user ${id}`);

    res.status(200).json({ success: true });
  } catch (error) {
    logger.log("error", `Error registering conversion for user ${id}`);

    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Offline Conversions from User
export const getOfflineConversionsAction = async (req, res) => {
  const { id } = req.params;

  logger.log("info", `Getting conversions for user ${id}`);

  try {
    const conversions = await database.getOfflineConversions(id);

    logger.log("info", `Conversions retrieved for user ${id}`);

    res.status(200).json({ conversions });
  } catch (error) {
    logger.log("error", `Error getting conversions for user ${id}`);

    res.status(500).json({ success: false, error: error.message });
  }
};
