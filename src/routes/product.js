const productModules = require('../modules/product/handlers/api_handler');

module.exports = (server) => {
  server.get('/v1/products', productModules.getProducts);
  server.get('/v1/product/:id', productModules.getProductById);
  server.post('/v1/product', productModules.postProduct);
  server.put('/v1/product/:id', productModules.updateProduct);
  server.del('/v1/product/:id', productModules.deleteProduct);
};