/* eslint-disable no-unused-vars */
const axios = require('axios');

const transformResponse = (response) => {
  const price = response.masterData && response.masterData.current.masterVariant.prices.find(p => p.value.currencyCode === 'USD').value;
  const transformed = {
    id: response.id,
    name: (response.name && response.name.en) || response.masterData.current.name.en,
    price: price && price.centAmount / (10 * price.fractionDigits)
  };
  return transformed;
};

exports.GetProducts = class GetProducts {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    this.defaultUrl = this.app.get('commercetools-url') + '/categories';
  }

  async find (params) {
    const response = (await axios.get(this.defaultUrl)).data;
    console.log(response.results.map(r => transformResponse(r)));
    return { data: response.results.map(r => transformResponse(r)) };
  }

  async get (id, params) {
    const getCategories = (await axios.get(this.defaultUrl)).data;
    console.log('getCategories: ', getCategories);
    const categories = getCategories.results.map(r => transformResponse(r))
    console.log('categories: ', categories);
    const category = categories.find(c => c.name === id);
    console.log('category: ', category);
    const response = (await axios.get(`${this.defaultUrl}/${category.id}`)).data;
    return { data: response.results.map(r => transformResponse(r)) };
  }
};
