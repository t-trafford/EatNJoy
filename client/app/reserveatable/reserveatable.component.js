import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./reserveatable.routes";
'use strict';


// const angular = require('angular');

export class reserveatableComponent {
  'ngInject';
  constructor($http, $scope, socket, $uibModal, Auth, Upload, appConfig) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.socket = socket;
    this.newBooking = {};
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.Upload = Upload;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;



  }
} 

export default angular.module('eatnjoyApp.reserveatable', [uiRouter])
.config(routing)
.component('reserveatable', {
    template: require('./reserveatable.html'),
    controller: reserveatableComponent
  })
  .name;
