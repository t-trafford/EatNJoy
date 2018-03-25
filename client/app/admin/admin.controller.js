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


  addEmployee() {
    this.user = {};
    var vm = this;
    var modalInstance = this.$uibModal.open({
      template: require("./addEmployee.html"),
      windowClass: "modal-default",
      controller: AdminController,
      controllerAs: "vm"
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

  saveEmployee(form, $close) {
    if (form.$invalid) {
      return;
    }
    if (this.user) {
      this.user.role = "employee"
    //  this.Auth.createUser(this.user).then(function(res) {
      this.$http.post("/api/users", this.user).then(function(res) {
        $close(res.data);
        this.getEmployee();
        // $close(res.data);
      });
    }
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}
