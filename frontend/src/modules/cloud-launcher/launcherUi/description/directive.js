module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.launch = () => {
        const DO = $scope.providers['digitalocean'],
              key = DO.credentials.token,
              wrapper = new DO.$rawAPI(key);

        console.log('wrapper', wrapper);

        console.log('launching', $scope.configuration);
        $scope.api.launch($scope.configuration)
                  .then(something => console.log('launched', something))
                  .catch(error => console.log('launch error', error));

        wrapper.dropletsGetAll((error, droplets, response) => {
          console.log(droplets, response);
          const headers = response.getAllResponseHeaders();

          console.log(droplets, headers);
        });
      };
    }]
  };
};