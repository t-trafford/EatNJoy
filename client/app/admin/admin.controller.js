'use strict';

export default class AdminController {
  /*@ngInject*/
  constructor(User, $http, $scope, socket, $uibModal, Auth, appConfig) {
    
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
    this.getEmployee();
  }
  user = {};

  getEmployee(){
    this.users = this.User.getEmployee();
  }


  addEmployee(user) {
    this.user =user|| {};
    var vm = this;
    var modalInstance = this.$uibModal.open({
      template: require("./addEmployee.html"),
      windowClass: "modal-default",
      controller: 'AddEditController',
      controllerAs: "vm",
      resolve:{
        user: function(){
          return (vm.user||{});
        }
      }
    });

    modalInstance.result.then(
      function(from) {
        console.log(from);
        vm.getEmployee();
        vm.user = {};
      },

      function() {
        console.log("modal-component dismissed at: " + new Date());
      }
    );
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}
