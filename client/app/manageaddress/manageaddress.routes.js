'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('manageaddress', {
    url: '/manageaddress',
    template: '<manageaddress></manageaddress>'
  });
}
