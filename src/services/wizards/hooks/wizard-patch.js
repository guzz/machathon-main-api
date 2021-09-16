// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    console.log('wizard patch hook');
    const { app, id } = context;
    let { data } = context;
    const currentWizard = await app.service('wizards').get(id);
    console.log('currentWizard: ', currentWizard);
    if (data.message) {
      let stepContent = data.message;
      if (typeof data.message === 'object' && data.message.text) {
        stepContent = data.message.text;
      }
      console.log('stepContent: ', stepContent);
      let stepIndex = data.stepIndex;
      if (!stepIndex) {
        const currentStep = currentWizard.steps.map((s, i) => {
          return {
            ...s,
            index: i
          };
        }).filter(s => !s.value && (!currentWizard.currentStep || s.index >= currentWizard.currentStep))[0];
        console.log('currentStep: ', currentStep);
        stepIndex = currentStep.index;
      }
      data.currentStep = stepIndex;
      data[`steps.${stepIndex}.value`] = stepContent;
    }
    console.log('data: ', data);
    return context;
  };
};
