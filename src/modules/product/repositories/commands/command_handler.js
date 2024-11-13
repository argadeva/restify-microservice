
const Domain = require('./domain');
const config = require('../../../../app/global_configs');
const DB = require('../../../../database/postgres/db');
const db = new DB(config.get('/postgresqlUrl'));
const domain = new Domain(db);

const postProduct = async (payload) => {
  return domain.postProduct(payload);
};

const updateProduct = async (payload) => {
  return domain.updateProduct(payload);
};

const deleteProduct = async (payload) => {
  return domain.deleteProduct(payload);
};
module.exports = {
  postProduct,
  updateProduct,
  deleteProduct,
};
