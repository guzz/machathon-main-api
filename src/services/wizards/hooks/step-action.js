// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const axios = require('axios');
const Mustache = require('mustache');

const execStep = async ({ app, data, result, params }, step) => {
  const { headers } = params;
  console.log('exec step: ', step);
  if (step.type === 'Input') {
    await app.service('messages').create({
      text: step.text,
      userTo: data.message.userFrom,
      tokenTo: data.message.tokenFrom,
      wizardId: result._id,
      transport: data.message.transport,
      options: step.userOptions || [],
      payload: result.payload
    });
  } else if (step.type === 'Submit') {
    const payload = {};
    result.steps.filter(s => {
      return s.type === 'Input' && s.value;
    }).forEach(step => {
      payload[step.key] = step.value;
    });
    try {
      const result = (
        await axios.post(
          Mustache.render(
            step.submitEndpoint,
            {
              authNotify: app.get('auth-notify-url')
            }
          ),
          { ...payload },
          {
            headers: {
              ...headers,
              notifySecret: app.get('notify-secret')
            }
          }
        )
      ).data;
      await app.service('wizards').patch(result._id, { message: result });
    } catch (err) {
      console.log(err);
    }
  } else if (step.type === 'Notification') {
    await app.service('messages').create({
      text: step.text,
      userTo: data.message.userFrom,
      tokenTo: data.message.tokenFrom,
      wizardId: result._id,
      transport: data.message.transport,
      options: step.userOptions || [],
      payload: result.payload
    });
    await app.service('wizards').patch(result._id, { message: true });
  }
};
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, result, method, app } = context;
    console.log('exec step: ', method);
    if (method === 'created') {
      await app.service('messages').patch(data.message._id, { wizardId: result._id });
    }
    const currentStep = result.steps.filter(s => !s.value)[0];
    console.log(currentStep);
    const stepContent = await app.service('get-content').get(currentStep.stepContentId);
    execStep(context, stepContent);
    return context;
  };
};
