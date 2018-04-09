'use strict';

describe('Component: managecard', function() {
  // load the component's module
  beforeEach(module('eatnjoyApp.managecard'));

  var managecardComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    managecardComponent = $componentController('managecard', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
