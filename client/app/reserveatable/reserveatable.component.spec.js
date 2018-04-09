'use strict';

describe('Component: reserveatable', function() {
  // load the component's module
  beforeEach(module('eatnjoyApp.reserveatable'));

  var reserveatableComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    reserveatableComponent = $componentController('reserveatable', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
