import "dotenv/config";
import postgres from "postgres";

export class DataBasePostgres {
  sql;

  constructor() {
    this.configure();
  }

  async configure() {
    const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
    const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`;

    this.sql = postgres(URL, { ssl: "require" });

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

    // Add created_at column
    await this.sql`
      ALTER TABLE conversions
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()
    `;
  }

  async saveOfflineConversion(uniqueId, conversion) {
    const { search, baseUrl, referrer } = conversion;

    // Save conversion in database
    await this.sql`
      INSERT INTO conversions (unique_id, search, base_url, referrer)
      VALUES (${uniqueId}, ${search}, ${baseUrl}, ${referrer})
    `;
  }

  async getOfflineConversions(uniqueId) {
    const conversions = await this.sql`
      SELECT * FROM conversions WHERE unique_id = ${uniqueId}
    `;

    return conversions;
  }
}
