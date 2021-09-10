const { JWTStrategy } = require('@feathersjs/authentication');
const axios = require('axios');
const AuthUrl = process.env.AUTH_URL || 'http://localhost:3031';

class CustomJwtStrategy extends JWTStrategy {
  async authenticate(data, params) {
    const { headers } = params;
    const response = (await axios.post(AuthUrl + '/authentication', data, { headers })).data;
    return response;
  }
}

module.exports = CustomJwtStrategy;