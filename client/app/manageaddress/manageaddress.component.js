import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./manageaddress.routes";


'use strict';
const angular = require('angular');

export class manageaddressComponent {
  newAddress = {};
  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal, Auth, appConfig) {
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
      socket.unsyncUpdates("item");
    });
}

$onInit() {
  this.getAddress();
}

getAddress() {
  this.$http.get("/api/address").then(response => {
    this.addresses = response.data;
    this.socket.syncUpdates("address", this.addresses);
  });
}


addAddress() {
  this.newAddress = {};
  var vm = this;
  var modalInstance = this.$uibModal.open({
    template: require("./add-address.html"),
    windowClass: "modal-default",
    controller: manageaddressComponent,
    controllerAs: "vm"
  });

  modalInstance.result.then(
    function(from) {
      console.log(from);
      this.getAddress();
      vm.newAddress = {};
      this.getAddress();

    },

    function() {
      console.log("modal-component dismissed at: " + new Date());
    }
  );
}

saveAddress(form, $close) {
  if (form.$invalid) {
    return;
  }
  if (this.newAddress) {
    this.$http.post("/api/address", this.newAddress).then(function(res) {
      $close(res.data);
      this.getAddress();
    });
  }
}

}

export default angular.module('eatnjoyApp.manageaddress', [uiRouter])
  .config(routing)
  .component('manageaddress', {
    template: require("./manageaddress.html"),
    controller: manageaddressComponent,
    controllerAs: "vm"
  })
  .name;
