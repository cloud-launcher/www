const _ = require('lodash');

module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.launch = () => {
        if (!$scope.configurationModified &&
            $scope.configurationOK) {

          $scope.launching = true;
          $scope.launchError = undefined;

          const {api, configuration: cloud} = $scope,
                missingProviderConfigurations = api.checkProviderConfigurations(cloud);

          if (_.keys(missingProviderConfigurations).length === 0) {
            api.launch(cloud)
               .then(something => {
                  console.log('launched', something);

                  $scope.$apply(() => {$scope.launching = false;});
                })
               .catch(error => {
                  console.log('launch error', error);
                  $scope.$apply(() => {
                    $scope.launching = false;
                    $scope.launchError = error;
                  });
                });
          }
          else {
            $scope.missingProviderConfigurations = missingProviderConfigurations;
            console.log($scope.missingProviderConfigurations);
          }
        }


        // const DO = $scope.providers['digitalocean'],
        //       key = DO.credentials.token,
        //       wrapper = new DO.$rawAPI(key);

        // console.log('wrapper', wrapper);

        // console.log('launching', $scope.configuration);

        // wrapper.dropletsGetAll((error, droplets, response) => {
        //   console.log(droplets, response);
        //   const headers = response.getAllResponseHeaders();

        //   console.log(droplets, headers);
        // });
      };
    }]
  };
};