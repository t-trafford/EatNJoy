'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('contactus', {
    url: '/contactus',
    template: '<contactus></contactus>'
  });
}
