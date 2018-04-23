import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./manageaddress.routes";


'use strict';
// const angular = require('angular');

export class manageaddressComponent {
  newAddress = {};
  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal, Auth, appConfig, Upload) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.socket = socket;
    this.newAddress = {};
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.Upload = Upload;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;


    $scope.$on("$destroy", function() {
      socket.unsyncUpdates("address");
    });
  }

  $onInit() {
    this.getAddress();
  }


  delete(address) {
    

    this.$http.delete("/api/address/" + address._id).then(response => {
      
      this.addresss.splice(this.addresss.indexOf(address), 1);
      this.$http.get("/api/address").then(response => {
        this.addresss = response.data;
        this.socket.syncUpdates("address", this.addresss);
      });
    });
  // user.$remove();

}


  getAddress() {
    this.$http.get("/api/address").then(response => {
      this.addresss = response.data;
      this.socket.syncUpdates("address", this.addresss);
    });
  }

  addAddress(address) {
    this.newAddress = angular.copy(address||{});
    var vm = this;
    var modalInstance = this.$uibModal.open({
      template: require("./add-address.html"),
      windowClass: "modal-default",
      controller: 'addAddressController',
      controllerAs: "vm",
      resolve:{
        address: function () {
          return vm.newAddress;
        }
      }
    });

    modalInstance.result.then(
      function(from) {
        console.log(from);
        vm.getAddress();
        vm.newAddress = {};
        vm.getAddress();

      },

      function() {
        console.log("modal-component dismissed at: " + new Date());
      }
    );
  }

}

export default angular
  .module("eatnjoyApp.manageaddress", [uiRouter])
  .config(routing)
  .controller('addAddressController',['$http', '$scope', 'socket', '$uibModal', 'Auth', 'appConfig','address', 
  function ($http, $scope, socket, $uibModal, Auth, appConfig,address) {
    var vm =this;
    vm.$http = $http;
    vm.newAddress = address||{};
    vm.socket = socket;
    vm.appConfig = appConfig;
    vm.$uibModal = $uibModal;
    vm.isLoggedIn = Auth.isLoggedInSync;
    vm.isAdmin = Auth.isAdminSync;
    vm.getCurrentUser = Auth.getCurrentUserSync;

    vm.saveAddress = function(form, $close) {
      if (form.$invalid) {
        return;
      }
      if (vm.newAddress._id) {
        delete vm.newAddress.__v;
        vm.$http.put("/api/address/"+vm.newAddress._id, vm.newAddress).then(function(res) {
          $close(res.data);
        });
      }else{
        vm.$http.post("/api/address", vm.newAddress).then(function(res) {
          $close(res.data);
        });
      }
    }

  }])
  .component('manageaddress', {
    template: require("./manageaddress.html"),
    controller: manageaddressComponent,
    controllerAs: "vm"
  })
  .name;

   

























