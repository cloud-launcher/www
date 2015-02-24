module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      const cost = {
        providers: {},
        total: 0
      };

      $scope.$on('configurationModified', ($event, configuration) => {
        setCost(configuration);
      });

      $scope.cost = cost;

      setCost($scope.configuration);

      function setCost(configuration) {
        cost.providers = {};
        cost.total = 0;

        // horrible
        for (var providerId in configuration.locations) {
          const sourceProvider = $scope.providers[providerId];

          const provider = cost.providers[providerId] = {
            name: sourceProvider.name,
            locations: {},
            total: 0
          };

          for (var locationIndex in configuration.locations[providerId]) {
            const locationName = configuration.locations[providerId][locationIndex],
                  sourceLocation = sourceProvider.locations[locationName];

            const location = provider.locations[locationName] = {
              name: locationName,
              vicinity: sourceLocation.vicinity,
              machineTypes: {},
              total: 0
            };

            const machineType = location.machineTypes['512MB'] = {
              size: '512MB',
              hourlyPrice: 70,
              count: 0,
              roles: {}
            };

            for (var roleName in configuration.configuration) {
              const count = configuration.configuration[roleName];

              const role = machineType.roles[roleName] = {
                name: roleName,
                count: count,
                cost: count * machineType.hourlyPrice
              };

              machineType.count += count;
              location.total += count * machineType.hourlyPrice;
            }

            provider.total += location.total;
          }

          cost.total += provider.total;
        }
      }
    }]
  };
};