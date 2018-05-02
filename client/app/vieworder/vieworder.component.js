import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './vieworder.routes';
'use strict';

export class vieworderComponent {
  /*@ngInject*/
  constructor($http, toaster, $scope, socket, $uibModal, Auth, appConfig) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.orders = {};
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.toaster = toaster;
    this.Auth = Auth;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isEmployee = Auth.isEmployeeSync;
    this.isCustomer = Auth.isCustomerSync;
    this.isDriver = Auth.isDriverSync;
    this.validateRoleSync = Auth.validateRoleSync;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('vieworder');
    });
  }

  $onInit() {
    this.getOrders();
  }

  getOrders() {
    this.$http.get('/api/orders').then(response => {
      this.orders = (response.data || []);
      console.log(this.orders);
    //  this.socket.syncUpdates("vieworder", this.orders);
    });
  }
  updateStatus(order, status) {
    if(!order || !status) {
      return;
    }
    order.status = status;
    this.$http.put('/api/orders/' + order._id, order).then(response => {
      console.log(response);
    });
  }
}

export default angular.module('eatnjoyApp.vieworder', [uiRouter])
.config(routing)
.component('vieworder', {
  template: require('./vieworder.html'),
  controller: vieworderComponent,
  controllerAs: 'vm'
})
  .name;
