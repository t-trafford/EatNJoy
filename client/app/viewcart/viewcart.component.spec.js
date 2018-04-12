'use strict';

describe('Component: viewcart', function() {
  // load the component's module
  beforeEach(module('eatnjoyApp.viewcart'));

  var viewcartComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    viewcartComponent = $componentController('viewcart', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
