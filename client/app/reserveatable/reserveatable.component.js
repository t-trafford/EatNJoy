import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './reserveatable.routes';
'use strict';

// const angular = require('angular');

export class reserveatableComponent {

  /*@ngInject*/
  constructor($http, toaster, $scope, socket, $uibModal, Auth, Upload, appConfig) {
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
    this.toaster = toaster;

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    var today = year + '-' + month + '-' + day;
    document
      .getElementById('theDate')
      .value = today;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('reserveatable');
    });
  }

  $onInit() {
    this.getCurrentBookingTable();
  }

  getCurrentBookingTable() {
    this
      .$http
      .get('/api/reservetables')
      .then(response => {
        this.reservetables = (response.data || []).map(itm => {
          itm.time = new Date(itm.time);
          return itm;
        });
        this
          .socket
          .syncUpdates('reservetables', this.reservetables);
      });
  }

  addBooking(form) {
    console.log(this.newBooking);
    if(form.$invalid) {
      return;
    }
    var vm = this;
    if(vm.newBooking._id) {
      delete vm.newBooking.__v;
      vm
        .$http
        .put('/api/reservetables/' + vm.newBooking._id, vm.newBooking)
        .then(function() {});
    } else {
      vm
        .$http
        .post('/api/reservetables', vm.newBooking)
        .then(function() {
          vm
            .toaster
            .pop('success', 'You will receive an email for your reservation.');
        });
    }
  }
}

export default angular
  .module('eatnjoyApp.reserveatable', [uiRouter])
  .config(routing)
  .component('reserveatable', {
    template: require('./reserveatable.html'),
    controller: reserveatableComponent,
    controllerAs: 'vm'
  })
  .name;
