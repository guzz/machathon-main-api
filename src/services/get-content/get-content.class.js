/* eslint-disable no-unused-vars */
const contentful = require('contentful');

exports.GetContent = class GetContent {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    this.client = contentful.createClient({
      space: 'gxhldjzy2htm',
      accessToken: app.get('contentful').delivery
    });
  }

  async create (data, params) {
    const query = Object.assign({}, data, { locale: params.locale || 'en-US' });
    const response = await this.client.getEntries(query);

    return response;
  }
};
