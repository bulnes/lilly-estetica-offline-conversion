import { DataBaseMemory } from "./repository/database-memory.js";
import { DataBasePostgres } from "./repository/database-postgres.js";

const isProduction = process.env.NODE_ENV !== "development";
const database = isProduction ? new DataBasePostgres() : new DataBaseMemory();

// Register Conversion
export const registerConversionAction = async (req, res) => {
  const { id } = req.params;
  const { search, baseUrl, referrer } = req.body;

  try {
    await database.saveOfflineConversion(id, { search, baseUrl, referrer });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Offline Conversions from User
export const getOfflineConversionsAction = async (req, res) => {
  const { id } = req.params;

  try {
    const conversions = await database.getOfflineConversions(id);
    res.status(200).json({ conversions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
