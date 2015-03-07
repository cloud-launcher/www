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

        wrapper.dropletsGetAll((error, droplets, response) => {
          console.log(droplets, response);
          const headers = response.getAllResponseHeaders();

          console.log(droplets, headers);
        });
      };
    }]
  };
};