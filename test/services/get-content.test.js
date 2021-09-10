const app = require('../../src/app');

describe('\'get-content\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-content');
    expect(service).toBeTruthy();
  });
});
