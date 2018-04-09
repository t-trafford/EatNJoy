'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('welcome', {
    url: '/welcome',
    template: '<welcome></welcome>'
  });
}
