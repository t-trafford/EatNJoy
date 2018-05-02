  'use strict';

  // import angular from 'angular';


  export default class LoginController {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.isEmployee = Auth.isEmployeeSync;
    this.isDriver = Auth.isDriverSync;
    this.isCustomer = Auth.isCustomerSync;
    this.isAdmin = Auth.isAdminSync;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid)
    {
      this.invalidlogin = false;
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          if(this.isCustomer() || this.isAdmin()) {
            this.$state.go('welcome');
          } else {
            this.$state.go('vieworder');
          }
        })
        .catch(err => {
          // this.errors.login = err.message;
          err = err.data;
          this.errors = {};
          // Update validity of form fields that match the mongoose errors
          this.invalidlogin = true;
        });
    }
  }
}
