import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./reserveatable.routes";
'use strict';


// const angular = require('angular');

export class reserveatableComponent {
  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal, Auth, Upload, appConfig) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.socket = socket;
    this.newBooking = {};
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.Upload = Upload;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    $scope.$on("$destroy", function() {
      socket.unsyncUpdates("card");
    });
  }

  $onInit() {
    this.getCurrentBookingTable();
  }

  getCurrentBookingTable() {

    this.$http.get("/api/reservetables").then(response => {
      this.reservetables = (response.data||[]).map(itm=>{
        itm.time = new Date(itm.time); 
        return itm;
      });
      this.socket.syncUpdates("reservetables", this.reservetables);
    });
  }

  addBooking(form) {
    if (form.$invalid) {
      return;
    }
    var vm =this;
    if (vm.newBooking._id) {
      delete vm.newBooking.__v;
      vm.$http.put("/api/reservetables/"+vm.newBooking._id, vm.newBooking).then(function(res) {
      });
    }else{
      vm.$http.post("/api/reservetables", vm.newBooking).then(function(res) {
      });
    }
  }
} 

export default angular.module('eatnjoyApp.reserveatable', [uiRouter])
.config(routing)
.component('reserveatable', {
    template: require('./reserveatable.html'),
    controller: reserveatableComponent,
    controllerAs: 'vm'
  })
  .name;
