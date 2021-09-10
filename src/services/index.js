const wizards = require('./wizards/wizards.service.js');
const stores = require('./stores/stores.service.js');
const message = require('./message/message.service.js');
const getContent = require('./get-content/get-content.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(wizards);
  app.configure(stores);
  app.configure(message);
  app.configure(getContent);
};
