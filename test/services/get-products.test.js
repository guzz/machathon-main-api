const app = require('../../src/app');

describe('\'get-products\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-products');
    expect(service).toBeTruthy();
  });
});
