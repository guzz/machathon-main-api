

const wizardAction = require('./hooks/wizard-action');

const insertVariables = require('./hooks/insert-variables');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [insertVariables()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [wizardAction()],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
