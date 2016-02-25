angular.module('Doccy.services')
  .factory('Documents', ['$resource', function($resource) {
    var documents = $resource('/api/documents/:id', {
      id: '@_id',
    }, {
      update: {
        // this method issues a PUT request
        method: 'PUT'
      }
    }, {
      stripTrailingSlashes: false

    });
    return documents;
  }]);
