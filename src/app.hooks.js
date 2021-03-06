// Application hooks that run for every service

module.exports = {
  before: {
    all: [
      context => {
        const { params, app } = context;
        const { headers } = params;
        if (headers && headers.notifysecret === app.get('notify-secret')) {
          params.provider = null;
        }
        return context;
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
