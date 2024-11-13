const Domain = require("./domain");
const config = require("../../../../app/global_configs");
const DB = require("../../../../database/postgres/db");
const db = new DB(config.get("/postgresqlUrl"));
const domain = new Domain(db);

const listProducts = async (payload) => {
  return domain.listProduct(payload);
};

const getProductById = async (payload) => {
  return domain.getProduct(payload);
};

module.exports = {
  listProducts,
  getProductById,
};
