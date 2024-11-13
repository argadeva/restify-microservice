const joi = require('joi');

const getProduct = joi.object().keys({
  id: joi.string().required()
});

const listProducts = joi.object().keys({
  page: joi.number().integer().default(1),
  limit: joi.number().integer().default(5)
});

module.exports = {
  getProduct,
  listProducts,
};
