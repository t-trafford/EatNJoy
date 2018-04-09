'use strict';

exports = module.exports = {
  // List of user roles
  userRoles: ['employee', 'user', 'manager', 'driver'],
  apiUrl: (process.env.NODE_ENV == 'production' ? 'http://localhost:3000/' : 'http://localhost:3000/')
};
