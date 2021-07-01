// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.HOST,
      port: process.env.PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
