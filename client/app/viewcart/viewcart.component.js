import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./viewcart.routes";
'use strict';

export class viewcartComponent {
    /*@ngInject*/
  constructor($http, toaster, $scope, socket, $uibModal, Auth, appConfig, $state) {
    
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.$state = $state;
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.cart = {};
    this.order = {};
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.Auth = Auth;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.toaster = toaster;

    $scope.$on("$destroy", function() {
      socket.unsyncUpdates("cart");
    });
    this.getCartItem();

    

  }

  $onInit() {
    this.getCartItem();
    this.getAddress();
    this.getCards();
  }
  // cart = {};

  getCartItem(){
    // this.users = this.User.getEmployee();

    this.$http.get("/api/carts").then(response => {
      this.carts = (response.data||[]);
    //  this.socket.syncUpdates("cart", this.carts);
    });
  }
  
  getAddress(){
    this.$http.get("/api/address").then(response => {
      this.addresses = (response.data||[]);
    });
  }

  getCards(){
    this.$http.get("/api/cards").then(response => {
      this.cards = (response.data||[]);
    });
  }
  
  getCartItem(){
    // this.users = this.User.getEmployee();

    this.$http.get("/api/carts").then(response => {
      this.carts = (response.data||[]);
    //  this.socket.syncUpdates("cart", this.carts);
    });
  }

  calculateTotalPrice(carts){
    return (carts||[]).reduce((c,n)=>{
      return c+(parseFloat(n.quantity)*parseFloat(n.item.price));
    },0).toFixed(2);
  }

  updateCarts(cart, inc){
    if (!cart || !cart._id ) {
      return;
    }
    if (inc==-1 && cart.quantity<=1) {
      return;
    }
    cart.quantity=cart.quantity+inc;
    this.$http.put("/api/carts/"+cart._id, cart).then(response => {
      
    });
  }

  checkout(){
    this.order.item = this.carts;
    this.order.price = this.calculateTotalPrice(this.carts);
    if (this.order && this.order.card && this.order.address && this.order.item && this.order.item.length) {
      this.$http.post("/api/orders/", this.order).then(response => {
        this.$state.go('vieworder');
      });
    }
  }

  deleteCartItem(cart){
    this.$http.delete("/api/carts/" + cart._id).then(response => {
      
      this.carts.splice(this.carts.indexOf(cart), 1);
      this.toaster.pop('error', "Item", "Removed From Cart.", 2000);
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
