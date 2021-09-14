// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { app, id } = context;
    let { data } = context;
    const currentWizard = await app.service('wizards').get(id);
    console.log(currentWizard);
    const currentStep = currentWizard.steps.map((s, i) => {
      return {
        ...s,
        index: i
      };
    }).filter(s => !s.value)[0];
    console.log(currentStep);
    let stepContent = data.message;
    if (typeof data.message === 'object' && data.message.text) {
      stepContent = data.message.text;
    }
    console.log(stepContent);
    data[`steps[${currentStep.index}]value`] = stepContent;
    console.log(data);
    return context;
  };
};
