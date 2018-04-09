'use strict';

import welcome from './welcome.component';
import {
  welcomecontroller
} from './welcome.component';

describe('Component: welcomecomponent', function() {
  beforeEach(angular.mock.module(welcome));
  beforeEach(angular.mock.module('stateMock'));
  beforeEach(angular.mock.module('socketMock'));

  var scope;
  var welcomecomponent;
  var state;
  var $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $http, $componentController, $rootScope, $state,
    socket) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    state = $state;
    welcomecomponent = $componentController('welcome', {
      $http,
      $scope: scope,
      socket
    });
  }));

  it('should attach a list of things to the controller', function() {
    welcomecomponent.$onInit();
    $httpBackend.flush();
    expect(welcomecomponent.awesomeThings.length)
      .toBe(4);
  });
});
