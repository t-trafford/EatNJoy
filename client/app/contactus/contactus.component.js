import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./contactus.routes";
'use strict';

export class contactusComponent {
  'ngInject';
  constructor($http, $scope, socket, $uibModal, Auth, Upload, appConfig) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.socket = socket;
    this.newItem = {};
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.Upload = Upload;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;

  }
} 

export default angular.module('eatnjoyApp.contactus', [uiRouter])
  .config(routing)
  .component('contactus', {
    template: require('./contactus.html'),
    controller: contactusComponent
  })
  .name;
