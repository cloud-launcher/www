const providers = require('launch-cloud-providers'),
      _ = require('lodash');

module.exports = ['newVersionCheck', newVersionCheck => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.providers = providers;

      $scope.availableSizes = _.flatten(_.map(providers, provider => {
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