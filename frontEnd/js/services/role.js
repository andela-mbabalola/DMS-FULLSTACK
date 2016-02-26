angular.module('Doccy.services')
  .factory('Roles', ['$resource', function($resource) {
    var roles = $resource('/api/role/superAdministrator/owner/:id', {
      id: '@_id',
    }, {
      update: {
        // this method issues a PUT request
        method: 'PUT'
      }
    }, {
      stripTrailingSlashes: false

    });
    return roles;
  }]);
