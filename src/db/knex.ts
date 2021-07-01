import Knex from "knex";
import config from "../config";
import knexConf from "../../knexfile.js";
import { rejects } from "assert";

export class KnexDB {
  db!: Knex;
  private initialized: boolean;
  private knexConfig: Knex.Config;

  constructor() {
    this.knexConfig = {};
    this.initialized = false;
  }

  async init(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      try {
        console.log("Knex init");
        console.log(config.PASSWORD);
        if (this.initialized) {
          return resolve(true);
        }
        this.knexConfig = {
          client: "pg",
          connection: {
            host: config.HOST,
            port: config.PORT,
            database: config.POSTGRES_DB,
            user: config.USERNAME,
            password: config.PASSWORD,
          },
          pool: {
            min: 2,
            max: 10,
          },
        };

        this.db = Knex(this.knexConfig);

        const resultT = this.db.raw("select 1 = 1");
        this.initialized = true;
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}

const db = new KnexDB();
export default db;
