'use strict';

describe('Component: vieworder', function() {
  // load the component's module
  beforeEach(module('eatnjoyApp.vieworder'));

  var vieworderComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    vieworderComponent = $componentController('vieworder', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
