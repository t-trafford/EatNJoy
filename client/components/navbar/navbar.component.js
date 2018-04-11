'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Welcome',
    state: 'welcome'
  }];

  isCollapsed = true;

  

  constructor(Auth) {
    'ngInject';

    this.Auth = Auth;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isEmployee = Auth.isEmployeeSync;
    this.isCustomer = Auth.isCustomerSync;
    this.isDriver = Auth.isDriverSync

  }

  $onInit() {
    var vm = this;

    vm.Auth.isLoggedIn((success) => {
      
    });
    
  }


}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
