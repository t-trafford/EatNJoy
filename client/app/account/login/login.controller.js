  'use strict';

  import angular from 'angular';


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
          this.$state.go('welcome');
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
