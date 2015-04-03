const _ = require('lodash');

module.exports = [
  'configurationLoader', 'launchCloud', 'newVersionCheck', 'storedClouds', 'storedConfiguration', 'storedCredentials', 'stageManager',
  (configurationLoader, launchCloud, newVersionCheck, storedClouds, storedConfiguration, storedCredentials, stageManager) => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      const {providers, isSimulator} = launchCloud;

      $scope.providers = providers;
      $scope.isSimulator = isSimulator;

      $scope.clouds = storedClouds.getClouds();

      $scope.stageManager = stageManager;
      $scope.stage = stageManager.stage;

      $scope.providerStatuses = _.mapValues(providers, (provider, providerName) => {
        console.log(provider, providerName);
        return provider.api.status;
      });

      $scope.configuration = storedConfiguration.getConfiguration() || {
        locations: {
          digitalocean: [ "sfo1" ]
        },
        configuration: {
          "viewer": 1
        },
        roles: {
          $all: [ "cadvisor" ],
          viewer: [ "benchmark-viewer", "fleet-ui" ]
        },
        containers: {
          cadvisor: {
            container: "google/cadvisor",
            ports: {
              8080: 8080
            },
            volumes: {
              "/": "/rootfs:ro",
              "/var/run": "/var/run:rw",
              "/sys": "/sys:ro",
              "/var/lib/docker": "/var/lib/docker:ro"
            }
          },
          "benchmark-viewer": {
            container: "cloudlauncher/benchmark-viewer",
            environment: {
              ETCD_HOST: "172.17.42.1"
            },
            ports: {
              80: 2771,
              4001: true
            }
          },
          "fleet-ui": {
            container: "purpleworks/fleet-ui",
            environment: {
              ETCD_PEER: "172.17.42.1"
            },
            ports: {
              3000: 3000
            },
            volumes: {
              "/home/core/.ssh/id_rsa": "/root/id_rsa"
            }
          }
        },
        authorizations: [ "40:85:f0:9b:28:ad:5d:25:b5:51:2e:ad:f3:b3:31:98" ]
      };

      storedConfiguration.removeConfiguration();


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