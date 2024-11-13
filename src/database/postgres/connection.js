const { Pool } = require("pg");
const connectionPool = new Map();

const config = require("../../app/global_configs");
const pgConfig = config.get("/postgresqlUrl");

const init = async () => {
  console.log(pgConfig);
  const pool = new Pool({ connectionString: pgConfig });
  const result = new Promise((resolve, reject) => {
    pool.connect((err, client) => {
      if (err) {
        reject(err);
        return;
      }
      client.on("error", (err) => {
        if (err.message !== "Connection terminated unexpectedly") {
          reject(err);
          return;
        }
      });
      resolve(pool);
      return;
    });
  });

  await result
    .then((res) => {
      console.log(`PostgreSQL - Connected to PostgreSQL`);
      connectionPool.set(pgConfig, res);
    })
    .catch((err) =>
      console.log(
        "postgresql connection",
        "connection error",
        "database initiation",
        err.stack,
      ),
    );
};

const getConnection = async () => {
  if (!connectionPool.has(pgConfig)) {
    await init(pgConfig);
  }
  return connectionPool.get(pgConfig);
};

module.exports = {
  init,
  getConnection,
};
