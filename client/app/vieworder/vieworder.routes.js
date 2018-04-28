'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('vieworder', {
    url: '/vieworder',
    template: '<vieworder></vieworder>'
  });
}
