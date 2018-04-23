import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./managecard.routes";


'use strict';

export class managecardComponent {
   newCard = {};
  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal, Auth, appConfig, Upload) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.socket = socket;
    this.newCard = {};
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
    this.getCard();
  }

  getCard() {
    this.$http.get("/api/cards").then(response => {
      this.cards = (response.data||[]).map(itm=>{
        itm.expdate = new Date(itm.expdate); 
        return itm;
      });
      this.socket.syncUpdates("card", this.cards);
    });
  }

  delete(card) {
    
    // this.users = this.User.getEmployee();

    this.$http.delete("/api/cards/" + card._id).then(response => {
      
      this.cards.splice(this.cards.indexOf(card), 1);
      this.$http.get("/api/cards").then(response => {
        this.cards = (response.data||[]).map(itm=>{
          itm.expdate = new Date(itm.expdate); 
          return itm;
        });
        this.socket.syncUpdates("card", this.cards);
      });
  
    });
  // user.$remove();

}

  addCard(card) {
    this.newCard = angular.copy(card||{});
    var vm = this;
    var modalInstance = this.$uibModal.open({
      template: require("./add-card.html"),
      windowClass: "modal-default",
      controller: 'addCardController',
      controllerAs: "vm",
      resolve:{
        card: function () {
          return vm.newCard;
        }
      }
    });

    modalInstance.result.then(
      function(from) {
        console.log(from);
        vm.getCard();
        vm.newCard = {};
        vm.getCard();
      },

      function() {
        console.log("modal-component dismissed at: " + new Date());
      }
    );
  }

}


export default angular.module('eatnjoyApp.managecard', [uiRouter])
  .config(routing)
  .controller('addCardController',['$http', '$scope', 'socket', '$uibModal', 'Auth', 'appConfig','card', 
  function ($http, $scope, socket, $uibModal, Auth, appConfig,card) {
    var vm =this;
    vm.$http = $http;
    vm.newCard = card||{};
    vm.socket = socket;
    vm.appConfig = appConfig;
    vm.$uibModal = $uibModal;
    vm.isLoggedIn = Auth.isLoggedInSync;
    vm.isAdmin = Auth.isAdminSync;
    vm.getCurrentUser = Auth.getCurrentUserSync;


    

    vm.saveCard = function(form, $close) {
      if (form.$invalid) {
        return;
      }
      if (vm.newCard._id) {
        delete vm.newCard.__v;
        vm.$http.put("/api/cards/"+vm.newCard._id, vm.newCard).then(function(res) {
          $close(res.data);
        });
      }else{
        vm.$http.post("/api/cards", vm.newCard).then(function(res) {
          $close(res.data);
        });
      }
    }

  }])


  .component('managecard', {
    template: require("./managecard.html"),
    controller: managecardComponent,
    controllerAs: "vm"
  })
  .name;