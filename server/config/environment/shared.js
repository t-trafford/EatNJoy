'use strict';

exports = module.exports = {
  // List of user roles
  userRoles: ['employee', 'user', 'manager'],
  apiUrl: (process.env.NODE_ENV == 'production' ? 'http://localhost:3000/' : 'http://localhost:3000/')
};
