const { v4: uuid } = require("uuid");
const Command = require("./command");
const Query = require("../queries/query");
const {
  InternalServerError,
  NotFoundError,
} = require("../../../../utils/error");
const wrapper = require("../../../../utils/wrapper");
const ctx = "Product-Command-Domain";

class Product {
  constructor(db) {
    this.command = new Command(db);
    this.query = new Query(db);
  }

  async postProduct(payload) {
    const { name, category, price } = payload;
    const document = {
      id: uuid(),
      name,
      category,
      price,
      createdat: new Date().toISOString(),
      modifiedat: new Date().toISOString(),
    };
    const result = await this.command.insertOne(document);
    if (result.err) {
      console.log(ctx, result.err, "can not insert product");
      return wrapper.error(new InternalServerError("can not insert product"));
    }
    return wrapper.data(document);
  }

  async updateProduct(payload) {
    const { id, name, category, price } = payload;
    if (!name && !category && !price)
      return wrapper.error(new ConflictError("no data to update"));
    const isIdExist = await this.query.findOne({ id }, { id: 0 }, true);
    if (isIdExist.err) {
      return wrapper.error(new NotFoundError("user not found"));
    }
    const data = { id: id };
    if (name) {
      data.name = name;
    }
    if (category) {
      data.category = category;
    }
    if (name) {
      data.category = category;
    }
    data.modifiedat = new Date().toISOString();
    const result = await this.command.updateOne({ id }, data);
    if (result.err) {
      console.log(
        ctx,
        "updateProduct",
        "can not update to database",
        result.err,
      );
      return wrapper.error(
        new InternalServerError("can not update to database"),
      );
    }
    return wrapper.data("user updated");
  }

  async deleteProduct(payload) {
    const { id } = payload;
    const product = await this.query.findOne({ id }, { id: 0 }, true);
    if (!product.data) {
      return wrapper.error(new NotFoundError("user not found"));
    }
    const result = await this.command.deleteOne({ id });
    if (result.err) {
      console.log(
        ctx,
        "deleteProduct",
        "can not delete from database",
        result.err,
      );
      return wrapper.error(
        new InternalServerError("can not delete from database"),
      );
    }
    return wrapper.data("user deleted");
  }
}

module.exports = Product;
