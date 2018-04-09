'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('managecard', {
    url: '/managecard',
    template: '<managecard></managecard>'
  });
}
