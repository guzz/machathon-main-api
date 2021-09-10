// Initializes the `get-content` service on path `/get-content`
const { GetContent } = require('./get-content.class');
const hooks = require('./get-content.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/get-content', new GetContent(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('get-content');

  service.hooks(hooks);
};
