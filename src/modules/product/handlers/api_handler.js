const validator = require('../../../utils/validator');
const { sendResponse } = require('../../../utils/response');
const queryModel = require('../repositories/queries/query_model');
const commandHandler = require('../repositories/commands/command_handler');
const commandModel = require('../repositories/commands/command_model');
const queryHandler = require('../repositories/queries/query_handler');

//query
const getProducts = async (req, res) => {
  const payload = { ...req.params, ...req.query };
  const validatePayload = validator.isValidPayload(payload, queryModel.listProducts);
  if (validatePayload.err) {
    return sendResponse(validatePayload, res);
  }
  const result = await queryHandler.listProducts(validatePayload.data);
  return sendResponse(result, res);
};

const getProductById = async (req, res) => {
  const payload = { ...req.params };
  const validatePayload = validator.isValidPayload(payload, queryModel.getProduct);
  if (validatePayload.err) {
    return sendResponse(validatePayload, res);
  }
  const result = await queryHandler.getProductById(validatePayload.data);
  return sendResponse(result, res);
};

// // command
const postProduct = async (req, res) => {
  const payload = { ...req.body };
  const validatePayload = validator.isValidPayload(payload, commandModel.postProduct());
  if (validatePayload.err) {
    return sendResponse(validatePayload, res);
  }
  const result = await commandHandler.postProduct(validatePayload.data);
  return sendResponse(result, res);
};

const updateProduct = async (req, res) => {
  const payload = { ...req.body, ...req.params };
  const validatePayload = validator.isValidPayload(payload, commandModel.updateProduct());
  if (validatePayload.err) {
    return sendResponse(validatePayload, res);
  }
  const result = await commandHandler.updateProduct(validatePayload.data);
  return sendResponse(result, res);
};

const deleteProduct = async (req, res) => {
  const payload = { ...req.params };
  const validatePayload = validator.isValidPayload(payload, commandModel.deleteProduct());
  if (validatePayload.err) {
    return sendResponse(validatePayload, res);
  }
  const result = await commandHandler.deleteProduct(validatePayload.data);
  return sendResponse(result, res);
};

module.exports = {
  getProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
};
