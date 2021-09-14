// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const axios = require('axios');

module.exports = (options = {}) => {
  return async context => {
    const { app, result, params } = context;
    const { headers } = params;
    if (result.userFrom || result.tokenFrom) {
      console.log('user message');
      try {
        if (!result.wizardId) {
          const wizard = await app.service('wizards').create({ message: result }, { headers });
          result.wizardId = wizard._id;
        } else {
          await app.service('wizards').patch(result.wizardId, { message: result }, { headers });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('robot message');
      const notifyUrl = app.get('auth-notify-url') + '/notify';
      await axios.post(notifyUrl, result, {
        headers: {
          notifySecret: app.get('notify-secret')
        }
      });
    }
    return context;
  };
};
