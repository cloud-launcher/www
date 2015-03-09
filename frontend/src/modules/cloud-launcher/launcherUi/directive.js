const apiInjector = require('launch-cloud-browser'),
      request = require('browser-request'),
      _ = require('lodash');

module.exports = ['newVersionCheck', 'storedCredentials', (newVersionCheck, storedCredentials) => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      const providerConfigs = {},
            api = apiInjector(providerConfigs, (...args) => console.log(...args), request),
            {providers} = api;

      $scope.api = api;
      $scope.providers = providers;

      _.each(providers, provider => {
        _.extend(provider, storedCredentials.getCredentials(provider.name) || {});
      });

      $scope.availableSizes = _.flatten(_.map(_.values(providers), provider => {
        return _.keys(provider.profile.sizes);
      }));

      $scope.$on('configurationModified', ($event, configuration) => {
        // this stuff is horribly named
        const locations = configuration.locations;
        if (locations) {
          for (var providerName in locations) {
            const provider = locations[providerName];

            for (var index in provider) {
              const location = provider[index];
              $scope.providers[providerName].profile.locations[location].selected = true;
            }
          }
        }
      });
    }]
  };
}];