const _ = require('lodash');

module.exports = [
  'launchCloud', 'newVersionCheck', 'storedClouds', 'storedCredentials',
  (launchCloud, newVersionCheck, storedClouds, storedCredentials) => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {

      const {providers} = launchCloud;

      $scope.providers = providers;
      $scope.clouds = storedClouds.getClouds();

      $scope.configuration = {
        locations: {
          digitalocean: [ "sfo1" ]
        },
        configuration: {
          benchmarker: 1
        },
        roles: {
          $all: [ "cadvisor" ]
        },
        containers: {
          benchmarker: {
            container: "instantchat/benchmarker",
            options: "-p 4001 -p 80:2771 -e ETCD_HOST=172.17.42.1"
          }
        },
        authorizations: [ "40:85:f0:9b:28:ad:5d:25:b5:51:2e:ad:f3:b3:31:98" ]
      };


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
        $scope.stage = 'launchpad';
        $scope.launchStatusVisible = false;
        $scope.cloudsVisible = false;
      };

      $scope.toggleClouds = () => {
        if ($scope.stage === 'clouds') {
          $scope.stage = 'launchpad';
          $scope.cloudsVisible = false;
        }
        else {
          $scope.stage = 'clouds';
          $scope.cloudsVisible = true;
        }
      };

      $scope.gotoStage = stage => {
        if (stage === 'launchpad') {
          $scope.stage = 'launchpad';
          $scope.launchPadVisible = true;
          $scope.launchStatusVisible = false;
          $scope.cloudsVisible = false;
        }
        else if (stage === 'launchstatus') {
          $scope.stage = 'launchstatus';
          $scope.launchPadVisible = true;
          $scope.launchStatusVisible = true;
          $scope.cloudsVisible = false;
        }
        else if (stage === 'clouds') {
          $scope.stage = 'clouds';
          $scope.launchPadVisible = true;
          // $scope.launchStatusVisible = true;
          $scope.cloudsVisible = true;
        }
        else throw new Error(`Unknown ${stage}`);
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