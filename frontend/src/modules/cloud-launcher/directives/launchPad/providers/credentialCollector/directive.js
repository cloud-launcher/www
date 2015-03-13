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
        _.each($scope.provider.credentials, credential => {
          if ($scope.provider.saveCredentials) storedCredentials.setCredentials($scope.provider.name, $scope.provider.saveCredentials, $scope.provider.credentials);
        });
        checkCredentials();
      };

      $scope.handleSave = $event => {
        if ($scope.provider.saveCredentials) {
          storedCredentials.setCredentials($scope.provider.name, true, $scope.provider.credentials);
        }
        else {
          storedCredentials.setCredentials($scope.provider.name, false);
        }
        checkCredentials();
      };

      function checkCredentials() {
        let hasCredentials = true;
        _.each($scope.provider.credentials, credential => {
          if (credential.length === 0) hasCredentials = false;
        });
        $scope.provider.hasCredentials = hasCredentials;
      }
    }]
  };
}];