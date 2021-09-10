// Initializes the `wizards` service on path `/wizards`
const { Wizards } = require('./wizards.class');
const createModel = require('../../models/wizards.model');
const hooks = require('./wizards.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/wizards', new Wizards(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wizards');

  service.hooks(hooks);
};
