const apiInjector = require('launch-cloud-browser'),
      _ = require('lodash');

module.exports = ['newVersionCheck', newVersionCheck => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      console.log(apiInjector);
      const providerConfigs = {};
      const api = apiInjector(providerConfigs);

      console.log(api);

      $scope.providers = _.reduce(api.providers, (providers, provider) => {
        providers[provider.name] = provider.profile;
        return providers;
      }, {});

      console.log($scope.providers);

      $scope.availableSizes = _.flatten(_.map($scope.providers, provider => {
        return _.keys(provider.sizes);
      }));

      $scope.$on('configurationModified', ($event, configuration) => {
        // this stuff is horribly named
        const locations = configuration.locations;
        if (locations) {
          for (var providerName in locations) {
            const provider = locations[providerName];

            for (var index in provider) {
              const location = provider[index];
              $scope.providers[providerName].locations[location].selected = true;
            }
          }
        }
      });
    }]
  };
}];