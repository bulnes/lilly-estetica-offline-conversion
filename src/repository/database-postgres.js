import "dotenv/config";
import postgres from "postgres";

export class DataBasePostgres {
  sql;
  data = new Map();

  constructor() {
    this.configure();
  }

  async configure() {
    const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
    const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`;

    this.sql = postgres(URL, { ssl: "require" });

    await this.createTables();
    const allConversions = await this.getAllConversions();

    // Save all conversions on memory
    allConversions.forEach((conversion) => {
      const { unique_id } = conversion;

      this.saveUniqueId(unique_id);
      this.saveConversionOnMemory(unique_id, conversion);
    });
  }

  async createTables() {
    // Create table conversions
    await this.sql`
      CREATE TABLE IF NOT EXISTS conversions (
        id SERIAL PRIMARY KEY,
        unique_id TEXT NOT NULL,
        search TEXT NOT NULL,
        base_url TEXT NOT NULL,
        referrer TEXT NOT NULL
      )
    `;
  }

  async getAllConversions() {
    // Get all conversions from database
    const data = await this.sql`
      SELECT * FROM conversions
    `;

    return Array.from(data);
  }

  saveConversionOnMemory(uniqueId, conversion) {
    user.conversions.push(conversion);
  }

  saveUniqueId(uniqueId) {
    this.data.set(uniqueId, []);
  }

  async saveOfflineConversion(uniqueId, conversion) {
    const { search, baseUrl, referrer } = conversion;

    this.saveConversionOnMemory(uniqueId, conversion);

    // Save conversion in database
    await this.sql`
      INSERT INTO conversions (unique_id, search, base_url, referrer)
      VALUES (${uniqueId}, ${search}, ${baseUrl}, ${referrer})
    `;
  }

  async getOfflineConversions(uniqueId) {
    const user = this.data.get(uniqueId);
    return Array.from(user.conversions);
  }
}
