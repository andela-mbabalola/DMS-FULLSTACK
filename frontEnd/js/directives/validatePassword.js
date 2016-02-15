angular.module('Doccy.directives')
  .directive('validatePassword', function() {
    return {
      require: 'ngModel',
      link: function(scope, el, attr, ngCtrl) {
        function validate(value) {
          var valid = (value === scope.$eval(attr.validatePassword));
          ngCtrl.$setValidity('equal', valid);
          return valid ? value : undefined;
        }
        ngCtrl.$parsers.push(validate);
        ngCtrl.$formatters.push(validate);
        scope.$watch(attr.validatePassword, function() {
          ngCtrl.$setViewValue(ngCtrl.viewValue);
        });

      }
    };
  });
