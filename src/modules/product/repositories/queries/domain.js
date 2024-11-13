const wrapper = require("../../../../utils/wrapper");
const { NotFoundError } = require("../../../../utils/error");
const Query = require("./query");
const Redis = require("../../../../database/redis/redis");
const ctx = "Product-Query-Domain";

class Product {
  constructor(db) {
    this.query = new Query(db);
    this.redisClient = new Redis();
  }

  async getProduct(payload) {
    const redisKey = `product-${payload.id}`;
    const redisData = await this.redisClient.getData(redisKey);
    if (redisData.data) {
      console.log(redisKey, ": get product from redis");
      return wrapper.data(JSON.parse(redisData.data));
    } else {
      console.log(redisKey, ": product not found in redis");
      const projection = {
        id: 0,
        name: 0,
        category: 0,
        price: 0,
        createdat: 0,
        modifiedat: 0,
      };
      const product = await this.query.findOne({ id: payload.id }, projection);
      if (product.err) {
        console.log(ctx, product.err, "can not find product");
        return wrapper.error(new NotFoundError("can not find product"));
      }
      const { data } = product;
      await this.redisClient.setDataEX(redisKey, data, 30);
      console.log(redisKey, ": set product to redis");
      return wrapper.data(data);
    }
  }

  async listProduct(payload) {
    const { page = 1, limit = 10 } = payload;
    const redisKey = `product-page-${page}-limit-${limit}`;
    const redisData = await this.redisClient.getData(redisKey);
    if (redisData.data) {
      console.log(redisKey, ": get list product from redis");
      return wrapper.data(JSON.parse(redisData.data));
    } else {
      const projection = {
        id: 0,
        name: 0,
        category: 0,
        price: 0,
        createdat: 0,
        modifiedat: 0,
      };
      const sort = { createdat: -1 };
      const product = await this.query.findAll(projection, sort, page, limit);
      if (product.err) {
        console.log(ctx, product.err, "can not find list product");
        product.data = [];
      }
      const { data } = product;
      await this.redisClient.setDataEX(redisKey, data, 30);
      console.log(redisKey, ": set list product to redis");
      return wrapper.data(data);
    }
  }
}

module.exports = Product;
