import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./welcome.routes";

export class welcomecontroller {
  items = [];
  newItem = {};

  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$uibModal = $uibModal;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;

    $scope.$on("$destroy", function() {
      socket.unsyncUpdates("item");
    });
  }

  $onInit() {
    this.getItem();
  }

  getItem(){
    this.$http.get("/api/items").then(response => {
      this.items = response.data;
      this.socket.syncUpdates("item", this.items);
    });
  }

  addItem() {
    this.newItem = {};
    var vm = this;
    var modalInstance = this.$uibModal.open({
      template: require("./add-item.html"),
      windowClass: "modal-default",
      controller: welcomecontroller,
      controllerAs: "vm"
    });

    modalInstance.result.then(
      function(from) {
        console.log(from);
        this.getItem();
        vm.newItem = {};
      },
      
      function() {
        console.log("modal-component dismissed at: " + new Date());
      }
    );
  }

  saveItem(form, $close) {
    if (form.$invalid) {
      return;
    }
    if (this.newItem) {
      this.$http.post("/api/items", this.newItem).then(function(res) {
        $close(res.data);
      });
    }
  }
}

export default angular
  .module("eatnjoyApp.welcome", [uiRouter])
  .config(routing)
  .component("welcome", {
    template: require("./welcome.html"),
    controller: welcomecontroller,
    controllerAs: "vm"
  }).name;
