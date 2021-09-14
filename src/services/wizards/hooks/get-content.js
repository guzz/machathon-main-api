// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, app, params } = context;
    const { headers } = params;
    const { message } = data;
    console.log('get content');
    if (!message) {
      throw new Error('no-message');
    }
    let content = (
      await app.service('get-content')
        .find({
          query: {
            content_type: 'wizard',
            'fields.title': message.text
          },
          headers
        })
    ).data[0];
    if (!content) {
      console.log('no content');
      content = (
        await app.service('get-content')
          .find({
            query: {
              content_type: 'step',
              'fields.type': 'Error',
              'fields.errorFor[exists]': false
            },
            headers
          })
      ).data[0];
      await app.service('messages').create({
        text: content.text,
        userTo: message.userFrom,
        tokenTo: message.tokenFrom,
        transport: message.transport,
        options: []
      });
      context.result = content;
    } else {
      console.log('create wizard');
      data.contentId = content.id;
      data.steps = content.steps.map(stp => {
        return {
          stepContentId: stp.id,
          stepType: stp.type,
          key: stp.inputKey,
          value: null,
          options: stp.userOptions
        };
      });
      if (message.userFrom) {
        data.userId = message.userFrom;
      } else if (message.tokenFrom) {
        data.userToken = message.tokenFrom;
      }
      console.log(data);
    }
    return context;
  };
};
