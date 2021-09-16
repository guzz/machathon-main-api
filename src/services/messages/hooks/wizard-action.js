// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const axios = require('axios');
const get = require('lodash/get');

module.exports = (options = {}) => {
  return async context => {
    const { app, result, params, data } = context;
    const { headers } = params;
    const payload = data.payload || params.payload;
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
      console.log('result.options: ', result.options);
      if (result.options.length > 0) {
        const dynamicOptions = result.options.filter(o => o.includes('{{') && o.includes('}}'));
        if (dynamicOptions.length > 0) {
          result.options = [
            ...result.options.filter(o => !o.includes('{{') && !o.includes('}}'))
          ];
          dynamicOptions.forEach(o => {
            const getFrom = o.split(':')[0].replace('{{', '').replace('}}', '');
            const property = o.split(':')[1] && o.split(':')[1].replace('}}', '');
            let items = get(payload, getFrom);
            console.log(getFrom);
            console.log(property);
            console.log(payload);
            console.log(items);
            if (Array.isArray(items)) {
              if (property) {
                items = items.map(i => get(i, property));
              }
              result.options = [
                ...result.options,
                ...items
              ];
            }
          });
        }
      }
      await axios.post(notifyUrl, Object.assign({}, result, payload), {
        headers: {
          notifySecret: app.get('notify-secret')
        }
      });
    }
    return context;
  };
};
