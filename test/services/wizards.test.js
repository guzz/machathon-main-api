const app = require('../../src/app');

describe('\'wizards\' service', () => {
  it('registered the service', () => {
    const service = app.service('wizards');
    expect(service).toBeTruthy();
  });
});
