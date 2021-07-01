import dotenv from "dotenv";

dotenv.config();

class Config {
  public POSTGRES_URL = process.env.POSTGRES_URL || "";
  public POOL_MIN = Number(process.env.DATABASE_POOL_MIN || "0");
  public POOL_MAX = Number(process.env.DATABASE_POOL_MAX || "10");
  public POSTGRES_DB = process.env.POSTGRES_DB || "demo";
  public PORT = parseInt(process.env.PG_PORT as string, 10) || 3002;
  public HOST = process.env.PG_HOST || "";
  public USERNAME = process.env.PG_USERNAME || "";
  public PASSWORD = process.env.PG_PASSWORD || "";

  constructor() {
    console.log("Config Loaded");
  }
}

export default new Config();
