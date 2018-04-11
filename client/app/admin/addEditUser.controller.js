'use strict';

export default class AddEditController {
  /*@ngInject*/
  constructor(User, $http, $scope, socket, $uibModal, Auth, appConfig, user) {
    
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.Auth = Auth;
    this.getCurrentUser = Auth.getCurrentUserSync;

    // Use the User $resource to fetch all users
    this.User = User;
    this.user = user||{};
    this.user['role']= this.user['role']||'user';
  }
  user = {};

  saveEmployee(form, $close) {
    if (form.$invalid) {
      return;
    }
    if (this.user._id) {
      delete this.user.__v;
      //  this.Auth.createUser(this.user).then(function(res) {
        this.$http.put("/api/users/"+this.user._id, this.user).then(function(res) {
          $close(res.data);
          // $close(res.data);
        });
      }else{
        this.user.role = this.user.role||"employee";
      this.$http.post("/api/users", this.user).then(function(res) {
        $close(res.data);
      });
    }
  }

}
