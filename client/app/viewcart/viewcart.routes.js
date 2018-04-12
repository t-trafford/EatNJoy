'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('viewcart', {
    url: '/viewcart',
    template: '<viewcart></viewcart>'
  });
}
