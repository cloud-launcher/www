const _ = require('lodash');

module.exports = ['launchCloud', 'newVersionCheck', 'storedCredentials', (launchCloud, newVersionCheck, storedCredentials) => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      const {providers} = launchCloud;

      $scope.configuration = {
        locations: {
          digitalocean: ['sfo1']
        },
        configuration: {
          influxdb: 1
        },
        roles: {
          $all: ['cadvisor']
        },
        containers: {
          influxdb: {
            container: 'tutum/influxdb'
          }
        },
        authorizations: ['40:85:f0:9b:28:ad:5d:25:b5:51:2e:ad:f3:b3:31:98']
      };

      $scope.providers = providers;

      _.each(providers, provider => {
        const credentials = storedCredentials.getCredentials(provider.name);
        _.merge(provider, credentials);
      });

      _.each(providers, checkCredentials); // find better place for this

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

      $scope.returnToLaunchpad = () => {
        $scope.launching = false;
      };

      function checkCredentials(provider) {
        let hasCredentials = true;
        _.each(provider.credentials, credential => {
          if (credential.length === 0) hasCredentials = false;
        });
        provider.hasCredentials = hasCredentials;
      }
    }]
  };
}];