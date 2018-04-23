import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./viewcart.routes";
'use strict';

export class viewcartComponent {
    /*@ngInject*/
  constructor($http, $scope, socket, $uibModal, Auth, appConfig) {
    
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.cart = {};
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.Auth = Auth;
    this.getCurrentUser = Auth.getCurrentUserSync;
    $scope.$on("$destroy", function() {
      socket.unsyncUpdates("viewcart");
    });
    this.getCartItem();
  }

  $onInit() {
    this.getCartItem();
  }
  // cart = {};

  getCartItem(){
    // this.users = this.User.getEmployee();

    this.$http.get("/api/carts").then(response => {
      this.carts = (response.data||[]);
      this.socket.syncUpdates("cart", this.carts);
    });
  }

  deleteCartItem(cart){
    this.$http.delete("/api/carts/" + cart._id).then(response => {
      
      this.carts.splice(this.carts.indexOf(cart), 1);
      this.$http.get("/api/carts").then(response => {
        this.carts = (response.data||[]).map(itm=>{
          itm.expdate = new Date(itm.expdate); 
          return itm;
        });
        this.socket.syncUpdates("cart", this.carts);
      });
  
    });
  }



}

export default angular.module('eatnjoyApp.viewcart', [uiRouter])
.config(routing)
.component('viewcart', {
    template: require('./viewcart.html'),
    controller: viewcartComponent,
    controllerAs: 'vm'
  })
  .name;
