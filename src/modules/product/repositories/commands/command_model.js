const joi = require('joi');

const postProduct = () => {
  return joi.object({
    name: joi.string().required(),
    category: joi.string().required(),
    price: joi.string().required(),
  });
};

const updateProduct = () => {
  return joi.object({
    id: joi.string().required(),
    name: joi.string().optional(),
    category: joi.string().optional(),
    price: joi.string().optional(),
  });
};

const deleteProduct = () => {
  return joi.object({
    id: joi.string().required(),
  });
};

module.exports = {
  postProduct,
  updateProduct,
  deleteProduct,
};
