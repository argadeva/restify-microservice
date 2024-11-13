const redis = require("redis");
let connectionPool = [];

const config = require("../../app/global_configs");
const redisConfig = config.get("/redis");
const ctx = "Connection redis";

const init = async () => {
  const currConnection = connectionPool.findIndex(
    (conf) => conf.config.toString() === redis.toString()
  );
  if (currConnection === -1) {
    const client = redis.createClient({
      retry_strategy: function (options) {
        if (options.error) {
          if (options.error.code === "ECONNREFUSED") {
            console.log(ctx, "The server refused the connection", "error");
            return new Error("The server refused the connection");
          }
          if (options.error.code === "ECONNRESET") {
            console.log(ctx, "The server reset the connection", "error");
            return new Error("The server reset the connection");
          }
          if (options.error.code === "ETIMEDOUT") {
            console.log(ctx, "The server timeouted the connection", "error");
            return new Error("The server timeouted the connection");
          }
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          console.log(ctx, "Retry time exhausted", "error");
          return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
          console.log(ctx, "Retry attempt exceed", "error");
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      },
      ...redisConfig,
      no_ready_check: true,
    });

    client.on("error", (err) => {
      console.error(`${ctx} - Redis error: ${err}`);
    });

    client.on("connect", () => {
      console.log(`${ctx} - Connected to Redis`);
    });

    client.on("ready", async () => {
      console.log(`${ctx} - Redis client ready`);
      connectionPool.push({ ...redisConfig, client });
    });

    await client.connect();

    return connectionPool;
  }
};

const getConnection = async () => {
  return connectionPool;
};

module.exports = {
  init,
  getConnection,
};
