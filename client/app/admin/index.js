'use strict';

import angular from 'angular';
import routes from './admin.routes';
import AdminController from './admin.controller';
import AddEditController from './addEditUser.controller';

export default angular.module('eatnjoyApp.admin', ['eatnjoyApp.auth', 'ui.router'])
  .config(routes)
  .controller('AdminController', AdminController)
  .controller('AddEditController', AddEditController)
  .name;
