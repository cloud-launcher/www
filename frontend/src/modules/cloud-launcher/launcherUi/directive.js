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

      $scope.configuration = {
        locations: {
          digitalocean: ['sfo1']
        },
        configuration: {
          www: 1,
          api: 2,
          influxdb: 1
        },
        roles: {
          $all: ['cadvisor']
        },
        containers: {
          api: {
            linkTo: ['influxdb']
          },
          influxdb: {
            container: 'tutum/influxdb'
          }
        },
        authorizations: ['40:85:f0:9b:28:ad:5d:25:b5:51:2e:ad:f3:b3:31:98']
      };

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

      $scope.cancelLaunch = () => {
        $scope.launching = false;
        // prompt('Are you sure you want to cancel launch?', '', () => {
        //   $scope.$apply(() => {
        //     $scope.launching = false;
        //   });
        // });
      };
    }]
  };
}];