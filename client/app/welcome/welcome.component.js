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
    this.Auth = Auth;
    this.newItem = {};
    this.appConfig = appConfig;
    this.$uibModal = $uibModal;
    this.Upload = Upload;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isEmployee = Auth.isEmployeeSync;
    this.isCustomer = Auth.isCustomerSync;
    this.isDriver = Auth.isDriverSync;

    $scope.$on("$destroy", function() {
      socket.unsyncUpdates("item");
    });
  }

  $onInit() {
    this.getItem();
  }
  
  addToCart(item) {
      if (this.Auth.isLoggedInSync()) {
        this.$http.post("/api/carts", {
          item: item._id
        }).then(function(res) {
        });
      }
  }

  getItem() {
    this.$http.get("/api/items").then(response => {
      this.items = response.data;
      this.socket.syncUpdates("item", this.items);
    });
  }

  addItem(item) {
    this.newItem = angular.copy(item||{});
    this.file = '';
    var vm = this;
    var modalInstance = this.$uibModal.open({
      template: require("./add-item.html"),
      windowClass: "modal-default",
      controller: 'addItemController',
      controllerAs: "vm",
      resolve:{
        item: function () {
          return vm.newItem;
        }
      }
    });

    modalInstance.result.then(
      function(from) {
        console.log(from);
        vm.getItem();
        vm.newItem = {};
        vm.getItem();

      },

      function() {
        console.log("modal-component dismissed at: " + new Date());
      }
    );
  }

}

export default angular
  .module("eatnjoyApp.welcome", [uiRouter])
  .config(routing)
  .controller('addItemController',['$http', '$scope', 'socket', '$uibModal', 'Auth', 'Upload', 'appConfig','item', 
  function ($http, $scope, socket, $uibModal, Auth, Upload, appConfig,item) {
    var vm =this;
    vm.$http = $http;
    vm.newItem = item||{};
    vm.socket = socket;
    vm.appConfig = appConfig;
    vm.$uibModal = $uibModal;
    vm.Upload = Upload;
    vm.isLoggedIn = Auth.isLoggedInSync;
    vm.isAdmin = Auth.isAdminSync;
    vm.getCurrentUser = Auth.getCurrentUserSync;


    vm.uploadFiles = function(file, form) {
      if (!file || form.file.$invalid) {
        return;
      }
      vm.Upload.upload({
        url: vm.appConfig.apiUrl + "api/upload",
        data: {
          file: file
        }
      }).then(
        resp => {
          vm.file = '';
          vm.newItem = vm.newItem ||{};
          vm.newItem.foodImage =
            resp.data.map(function(data) {
              var x = "assets/images/uploads/".concat(data.filename || "");
              
              return (x || "");
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
    };

    vm.saveItem = function(form, $close) {
      if (form.$invalid) {
        return;
      }
      if (vm.newItem._id) {
        delete vm.newItem.__v;
        vm.$http.put("/api/items/"+vm.newItem._id, vm.newItem).then(function(res) {
          $close(res.data);
        });
      }else{
        vm.$http.post("/api/items", vm.newItem).then(function(res) {
          $close(res.data);
        });
      }
    }

  }])
  .component("welcome", {
    template: require("./welcome.html"),
    controller: welcomecontroller,
    controllerAs: "vm"
  }).name;
