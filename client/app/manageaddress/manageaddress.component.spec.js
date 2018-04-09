'use strict';

describe('Component: manageaddress', function() {
  // load the component's module
  beforeEach(module('eatnjoyApp.manageaddress'));

  var manageaddressComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    manageaddressComponent = $componentController('manageaddress', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
