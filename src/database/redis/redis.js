const wrapper = require("../../utils/wrapper");
const pool = require("./connection");
const validate = require("validate.js");
const config = require("../../app/global_configs");
const redisConfig = config.get("/redis");

class Redis {
  constructor() {
    this.index = redisConfig.index;
  }

  async getData(key) {
    let client = await pool.getConnection();
    if (validate.isEmpty(client)) {
      client = await pool.init();
    }
    const clientRedis = client[0].client;
    await clientRedis.select(this.index);
    const data = await clientRedis.get(key);
    return wrapper.data(data);
  };

  async setData(key, value) {
    let client = await pool.getConnection();
    if (validate.isEmpty(client)) {
      client = await pool.init();
    }
    const data = JSON.stringify(value);
    const clientRedis = client[0].client;
    await clientRedis.select(this.index);
    await clientRedis.set(key, data);
    return wrapper.data("data inserted");
  }

  async setDataEX(key, value, expired) {
    let client = await pool.getConnection();
    if (validate.isEmpty(client)) {
      client = await pool.init();
    }
    const data = JSON.stringify(value);
    const clientRedis = client[0].client;
    await clientRedis.select(this.index);
    await clientRedis.set(key, data);
    await clientRedis.expire(key, expired);
    return wrapper.data("data inserted");
  }
}

module.exports = Redis;
