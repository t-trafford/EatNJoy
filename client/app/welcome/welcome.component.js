import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./welcome.routes";

export class welcomecontroller {
  newItem = {};
  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal, Auth, Upload, appConfig) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.socket = socket;
    this.newItem = {};
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
    this.getItem();
  }


  uploadFiles(file, form) {
    if (!file || form.file.$invalid) {
      return;
    }
    var vm = this;
    this.Upload.upload({
      url: this.appConfig.apiUrl + "api/upload",
      data: {
        file: file
      }
    }).then(
      resp => {
        vm.file = '';
        vm.newItem = vm.newItem ||{};
        vm.newItem.foodImage =
          resp.data.map(function(data) {
            var x = (data.path || "").split("client/");
            if (x && x.length > 0) {
              data.path = x[1];
            }
            return (data.path || "").replace("client/", "");
          })[0] || "";
        console.log("Success uploaded");
      },
      function(resp) {
        console.log("Error status: " + resp.status);
      },
      function(evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log("progress: " + progressPercentage + "%");
      }
    );
  }

  getItem() {
    this.$http.get("/api/items").then(response => {
      this.items = response.data;
      this.socket.syncUpdates("item", this.items);
    });
  }

  addItem() {
    this.newItem = {};
    this.file = '';
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
        this.getItem();

      },

      function() {
        console.log("modal-component dismissed at: " + new Date());
      }
    );
  }

  updateItem(item) {
    this.newItem = item;
    this.file = '';
    var vm = this;
    var modalInstance = this.$uibModal.open({
      template: require("./add-item.html"),
      windowClass: "modal-default",
      // controller: welcomecontroller,
      // controllerAs: "vm",

    });

    modalInstance.result.then(
      function(from) {
        console.log(from);
        this.getItem();
        vm.newItem = {};
        this.getItem();

      }, 
    );
  }

  saveItem(form, $close) {
    if (form.$invalid) {
      return;
    }
    if (this.newItem) {
      this.$http.post("/api/items", this.newItem).then(function(res) {
        $close(res.data);
        this.getItem();
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
