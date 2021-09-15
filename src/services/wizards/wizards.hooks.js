

const getContent = require('./hooks/get-content');

const stepAction = require('./hooks/step-action');

const wizardPatch = require('./hooks/wizard-patch');
const { fastJoin } = require('feathers-hooks-common');

const itemResolvers = {
  joins: {
    payload: () => (wizard) => {
      console.log('payload resolver');
      const payload = {};
      console.log('wizards: ', wizard.steps.filter(step => step.value));
      wizard.steps.filter(step => step.value).forEach(step => {
        payload[step.key] = step.value;
        console.log('step: ', step);
      });
      console.log('payload: ', payload);
      return wizard.payload = payload;
    }
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
