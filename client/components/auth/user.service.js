'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    
    },
    getEmployee: {
      method: 'GET',
      params: {
        role: 'employee'
      },
      isArray:true,
      url: '/api/users/employee/of/:role'
    }
  });
}
