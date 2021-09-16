// Initializes the `get-products` service on path `/get-products`
const { GetProducts } = require('./get-products.class');
const hooks = require('./get-products.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/get-products', new GetProducts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('get-products');

  service.hooks(hooks);
};
