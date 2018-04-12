import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./viewcart.routes";

export class viewcartComponent {
  constructor(cart, $http, $scope, socket, $uibModal, Auth, appConfig) {
    
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.Auth = Auth;
    this.getCurrentUser = Auth.getCurrentUserSync;

    // Use the User $resource to fetch all users
    this.cart = cart;
    $scope.$on("$destroy", function() {
      socket.unsyncUpdates("cart");
    });
    this.getCartItem();
  }
  cart = {};

  getCartItem(){
    // this.users = this.User.getEmployee();

    this.$http.get("/api/carts").then(response => {
      this.cart = (response.data||[]);
      this.socket.syncUpdates("cart", this.cart);
    });
  }

}

export default angular
  .module("eatnjoyApp.viewcart", [uiRouter])
  .config(routing)
  .controller('addItemController',['$http', '$scope', 'socket', '$uibModal', 'Auth', 'Upload', 'appConfig','item', 'cart',
  function ($http, $scope, socket, $uibModal, Auth, Upload, appConfig,item) {
    var vm =this;
    vm.$http = $http;
    vm.newCart = cart||{};
    vm.socket = socket;
    vm.appConfig = appConfig;
    vm.$uibModal = $uibModal;
    vm.Upload = Upload;
    vm.isLoggedIn = Auth.isLoggedInSync;
    vm.isAdmin = Auth.isAdminSync;
    vm.isCustomer = Auth.isCustomerSync;
    vm.getCurrentUser = Auth.getCurrentUserSync;
    vm.validateRoleSync = Auth.validateRoleSync;


       

  

  }])
  .component('viewcart', {
    template: require("./viewcart.html"),
    controller: viewcartComponent,
    controllerAs: "vm"
  })
  .name;
