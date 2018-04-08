'use strict';

describe('Component: contactus', function() {
  // load the component's module
  beforeEach(module('eatnjoyApp.contactus'));

  var contactusComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    contactusComponent = $componentController('contactus', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
