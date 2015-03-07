var _ = require('lodash');

module.exports = [() => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    scope: {
      provider: '='
    },
    link: () => {
      console.log('link');
    },
    controller: ['$scope', 'storedCredentials', ($scope, storedCredentials) => {
      $scope.credentialsChanged = $event => {
        console.log($scope);
        _.each($scope.provider.credentials, credential => {
          if (credential.length > 0) $scope.provider.hasCredential = true;
          if ($scope.provider.saveCredentials) storedCredentials.setCredentials($scope.provider.name, $scope.provider.saveCredentials, $scope.provider.credentials);
        });
      };

      $scope.handleSave = $event => {
        if ($scope.provider.saveCredentials) {
          storedCredentials.setCredentials($scope.provider.name, true, $scope.provider.credentials);
        }
        else {
          storedCredentials.setCredentials($scope.provider.name, false);
        }
      };
    }]
  };
}];