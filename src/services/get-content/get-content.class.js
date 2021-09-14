/* eslint-disable no-unused-vars */
const contentful = require('contentful');

const renderRichText = (contents) => {
  let renderedString = '';
  contents.forEach(content => {
    const value = content.content[0].value + '\n';
    renderedString = renderedString + value;
  });
  return renderedString;
};

const transformContent = (object = {}, params) => {
  const transformedObject = {};
  const { fields } = object;
  const iterateFrom = fields || object;
  Object.keys(iterateFrom).forEach(key => {
    const value = iterateFrom[key];
    if (Array.isArray(value) && value[0].sys) {
      transformedObject[key] = value.map(v => transformContent(v));
    } else if (typeof value === 'object' && value.sys) {
      transformedObject[key] = transformContent(value);
    } else if (typeof value === 'object' && value.nodeType === 'document') {
      transformedObject[key] = renderRichText(value.content);
    } else {
      transformedObject[key] = value;
    }
  });
  if (object.sys) {
    transformedObject.id = object.sys.id;
  }
  return transformedObject;
};

exports.GetContent = class GetContent {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    this.client = contentful.createClient({
      space: 'gxhldjzy2htm',
      accessToken: app.get('contentful').delivery
    });
  }

  async find (params) {
    const query = Object.assign({}, params.query, { locale: params.locale || 'en-US' });
    const response = await this.client.getEntries(query);

    return {
      $skip: response.skip,
      $limit: response.limit,
      total: response.total,
      data: response.items.map(it => transformContent(it))
    };
  }

  async get (id, params) {
    const response = await this.client.getEntry(id);
    return transformContent(response);
  }

};
