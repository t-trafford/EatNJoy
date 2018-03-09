'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('eatnjoyApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
