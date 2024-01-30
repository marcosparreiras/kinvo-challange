import type { Knex } from "knex";

export default <{ [key: string]: Knex.Config }>{
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/mydb.sqlite",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations",
      extension: "ts",
    },
    pool: {
      afterCreate: (conn: any, cb: any) =>
        conn.run("PRAGMA foreign_keys = ON", cb),
    },
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: "./db/test.sqlite",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations",
      extension: "ts",
    },
    pool: {
      afterCreate: (conn: any, cb: any) =>
        conn.run("PRAGMA foreign_keys = ON", cb),
    },
  },
};
