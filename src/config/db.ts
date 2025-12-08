import { Pool } from "pg";
import config from "./index";

if (!config.connection_str) {
  throw new Error("CONNECTION_STR is not set in environment");
}

export const pool = new Pool({
  connectionString: config.connection_str,
  ssl: {
    rejectUnauthorized: false, // Neon friendly
  },
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDB = () => {
  pool
    .connect()
    .then((client) => {
      console.log("✅ Connected to Postgres");
      client.release();
    })
    .catch((err) => {
      console.error("❌ Failed to connect to Postgres", err);
    });
};
