'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('reserveatable', {
    url: '/reserveatable',
    template: '<reserveatable></reserveatable>'
  });
}
