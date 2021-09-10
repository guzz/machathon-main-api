const { AuthenticationService } = require('@feathersjs/authentication');

const { expressOauth } = require('@feathersjs/authentication-oauth');

const CustomJwtStrategy = require('./authentication/custom-jwt');

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new CustomJwtStrategy());


  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
