const _ = require('lodash');

module.exports = ['$timeout', 'launchCloud', ($timeout, launchCloud) => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.launch = () => {
        if (!$scope.configurationModified &&
            $scope.configurationOK) {

          $scope.launching = true;
          $scope.launchLog = [];
          $scope.launchStatus = 'Launching...';
          $scope.launchError = undefined;
          $scope.missingCredentials = undefined;

          const {configuration: cloud} = $scope;

          $timeout(
            () =>
              launchCloud.launch(_.cloneDeep(cloud), launchLog)
               .then(something => {
                  console.log('launched', something);

                  $scope.$apply(() => {
                    $scope.launchStatus = 'Launched!';
                    $scope.launching = false;
                  });
                })
               .catch(error => {
                  console.log('launch error', error);

                  if (error.type === 'Credentials') {
                    $scope.missingCredentials = error.missing;
                  }

                  $scope.$apply(() => {
                    $scope.launchStatus = 'Launch Error!';
                    $scope.launchError = error;
                  });
                }), 0);
        }
      };

      function launchLog(...args) {
        $scope.$apply(() => $scope.launchLog.push(args.join(' ')));
      }
    }]
  };
}];