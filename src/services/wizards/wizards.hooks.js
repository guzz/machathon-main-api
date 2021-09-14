

const getContent = require('./hooks/get-content');

const stepAction = require('./hooks/step-action');

const wizardPatch = require('./hooks/wizard-patch');
const { fastJoin } = require('feathers-hooks-common');

const itemResolvers = {
  payload: () => async (wizard) => {
    const payload = {};
    wizard.steps.filter(step => step.value).forEach(step => {
      payload[step.key] = step.value;
    });
    wizard.payload = payload;
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [getContent()],
    update: [],
    patch: [wizardPatch()],
    remove: []
  },

  after: {
    all: [fastJoin(itemResolvers)],
    find: [],
    get: [],
    create: [stepAction()],
    update: [],
    patch: [stepAction()],
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
