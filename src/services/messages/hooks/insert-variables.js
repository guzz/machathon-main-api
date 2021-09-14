// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const Mustache = require('mustache');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, params } = context;
    const { user = {} } = params;
    const { payload = {} } = data;
    console.log(data);
    data.text = Mustache.render(data.text, { user, payload });
    return context;
  };
};
