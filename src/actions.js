import { DataBaseMemory } from "./repository/database-memory.js";
import { DataBasePostgres } from "./repository/database-postgres.js";
import { generateUniqueId } from "./utils.js";

const isProduction = process.env.NODE_ENV !== "development";
const database = isProduction ? new DataBasePostgres() : new DataBaseMemory();

// Create Unique User ID
export const generateUniqueIdAction = (req, res) => {
  const uniqueId = generateUniqueId();

  try {
    database.saveUniqueId(uniqueId);
    res.status(200).json({ id: uniqueId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Register Conversion
export const registerConversionAction = (req, res) => {
  const { id } = req.params;
  const { search, baseUrl, referrer } = req.body;

  try {
    database.saveOfflineConversion(id, { search, baseUrl, referrer });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Offline Conversions from User
export const getOfflineConversionsAction = (req, res) => {
  const { id } = req.params;

  try {
    const conversions = database.getOfflineConversions(id);
    res.status(200).json({ conversions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
