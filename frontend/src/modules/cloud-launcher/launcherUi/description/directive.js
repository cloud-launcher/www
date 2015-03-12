const _ = require('lodash');

module.exports = ['$timeout', $timeout => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.launch = () => {
        if (!$scope.configurationModified &&
            $scope.configurationOK) {

          $scope.launching = true;
          $scope.launchLog = [];
          $scope.launchError = undefined;
          $scope.missingCredentials = undefined;

          const {api, configuration: cloud} = $scope;

          $timeout(
            () =>
              api.launch(_.cloneDeep(cloud), launchLog)
               .then(something => {
                  console.log('launched', something);

                  $scope.$apply(() => {$scope.launching = false;});
                })
               .catch(error => {
                  console.log('launch error', error);

                  if (error.type === 'Credentials') {
                    $scope.missingCredentials = error.missing;
                  }

                  $scope.$apply(() => {
                    $scope.launchError = error;
                  });
                }), 500);
        }
      };

      function launchLog(...args) {
        $scope.$apply(() => $scope.launchLog.push(args.join(' ')));
      }
    }]
  };
}];