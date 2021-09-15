// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const axios = require('axios');
const get = require('lodash/get');
const Mustache = require('mustache');

const getCurrentStepIndex = (wizard, step) => {
  const stepsWithIndex = wizard.steps.map((s, i) => {
    return {
      ...s,
      index: i
    };
  }).filter(s => s.stepContentId === step.id)[0];
  const stepIndex = stepsWithIndex.index;
  return stepIndex;
};

const conditionsMatch = {
  contains: ({ from, value }) => from.includes(value),
  'is equal to': ({ from, value }) => from == value,
  'is greater then': ({ from, value }) => from > value,
  'is greater or equal': ({ from, value }) => from >= value,
  'is lower then': ({ from, value }) => from < value,
  'is lower or equal': ({ from, value }) => from <= value
};

const checkIfMatchCondition = ({ payload, user }, condition) => {
  console.log('checkIfMatchCondition function');
  console.log('payload: ', payload);
  console.log('user: ', user);
  const from = get({ payload, user }, condition.from);
  console.log('condition: ', condition);
  console.log('from: ', from);
  const value = condition.value;
  console.log('value: ', value);
  const isMatch = conditionsMatch[condition.comparison]({ from, value });
  console.log('isMatch: ', isMatch);
  return isMatch;
};

const execStep = async ({ app, data, result, params }, stepId) => {
  const step = await app.service('get-content').get(stepId);
  const stepIndex = getCurrentStepIndex(result, step);
  const nextStep = result.steps[stepIndex + 1];
  console.log('exec step: ', step);
  console.log('result :', result);
  if (step.conditions && step.conditions.length > 0) {
    const matches = step.conditions.map((condition) => {
      return checkIfMatchCondition(
        {
          payload: result.payload,
          user: params.user || {}
        },
        condition
      );
    }).filter(v => !!v)[0];
    if (!matches) {
      if (!nextStep) {
        return finishWizard({ app, data, result, params });
      } else {
        return execStep({ app, data, result, params }, nextStep.stepContentId);
      }
    }
  }
  if (result.steps[stepIndex].value) {
    if (!nextStep) {
      return finishWizard({ app, data, result, params });
    } else {
      return execStep({ app, data, result, params }, nextStep.stepContentId);
    }
  }
  if (step.type === 'Input') {
    await app.service('messages').create({
      text: step.text,
      userTo: data.message.userFrom,
      tokenTo: data.message.tokenFrom,
      wizardId: result._id,
      transport: data.message.transport,
      options: step.userOptions || [],
      payload: result.payload
    }, {
      payload: params.payload
    });
  } else if (step.type === 'Submit') {
    console.log('step submit');
    const endPoint = Mustache.render(
      step.submitEndpoint,
      {
        authNotify: app.get('auth-notify-url')
      }
    );
    const payload = result.payload;
    console.log('endPoint: ', endPoint);
    console.log('payload: ', payload);
    try {
      const submitResult = (
        await axios.post(
          endPoint,
          payload,
          {
            headers: {
              notifySecret: app.get('notify-secret')
            }
          }
        )
      ).data;
      console.log('submitResult: ', submitResult);
      const submitData = {
        message: Object.assign({}, data.message, submitResult),
        stepIndex
      };
      console.log('submitData: ', submitData);
      await app.service('wizards').patch(result._id, submitData, { payload: submitResult });
    } catch (err) {
      console.log('Submit error');
      console.log((err.response && err.response.data) || err);
    }
  } else if (step.type === 'Notification') {
    console.log('step notification');
    await app.service('messages').create({
      text: step.text,
      userTo: data.message.userFrom,
      tokenTo: data.message.tokenFrom,
      wizardId: result._id,
      transport: data.message.transport,
      options: step.userOptions || [],
      payload: result.payload
    }, {
      payload: params.payload
    });
    const submitData = {
      message: Object.assign({}, data.message, { text: 'success' }),
      stepIndex
    };
    console.log('submitData: ', submitData);
    await app.service('wizards').patch(result._id, submitData);
  }
};

const finishWizard = async ({ app, data, result, params }) => {
  console.log('finishWizard function');
  result = await app.service('wizards').patch(result._id, { isDone: true });
  console.log('data: ', data);
  await app.service('messages').create({
    userTo: data.message.userFrom,
    tokenTo: data.message.tokenFrom,
    wizardId: null,
    transport: data.message.transport,
    payload: result.payload
  }, {
    payload: params.payload
  });
};
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    console.log('step action');
    const { data, result, method, app } = context;
    console.log('exec step: ', method);
    if (method === 'created') {
      await app.service('messages').patch(data.message._id, { wizardId: result._id });
    }
    let currentStep = result.steps.filter(s => !s.value)[0];
    if (result.currentStep) {
      currentStep = result.steps[result.currentStep];
    }
    console.log('currentStep: ', currentStep);
    console.log('data: ', data);
    if (!currentStep && data.message) {
      await finishWizard(context);
    } else if (data.message) {
      await execStep(context, currentStep.stepContentId);
    }
    return context;
  };
};
