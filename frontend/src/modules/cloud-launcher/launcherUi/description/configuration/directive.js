module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      const configuration = {
        domain: 'cloud-launcher.io',
        root: 'https://github.com/cloud-launcher',
        authorizations: ['40:85:f0:9b:28:ad:5d:25:b5:51:2e:ad:f3:b3:31:98'],
        locations: {
          digitalocean: ['sfo1']
        },
        configuration: {
          www: 1,
          api: 2,
          influxdb: 1
        },
        roles: {
          all: ['cadvisor']
        },
        containers: {
          api: {
            linkTo: ['influxdb']
          },
          influxdb: {
            container: 'tutum/influxdb'
          }
        }
      };

      $scope.configuration = configuration;

      $scope.$on('containerModified', ($event, name, selected) => {
        const parts = name.split('/');

        let [repo, container] = parts;

        if (container === undefined) container = repo;

        if (selected) {
          if (parts.length > 1) {
            configuration.configuration[container] = 1;
            configuration.containers[container] = {
              container: name
            };
          }
          else {
            configuration.configuration[name] = 1;
          }
        }
        else {
          if (parts.length > 1) {
            delete configuration.configuration[container];
            delete configuration.containers[container];
          }
          else {
            delete configuration.configuration[name];
          }
        }

        setText();
        $scope.$broadcast('configurationModified', configuration);
      });

      $scope.$on('locationModified', ($event, provider, location, selected) => {
        if (selected) {
          let locations = configuration.locations[provider] = configuration.locations[provider] || [];

          if (locations.indexOf(location) === -1) locations.push(location);
        }
        else {
          let locations = configuration.locations[provider];
          if (locations) {
            const index = locations.indexOf(location);
            if (index !== -1) {
              locations.splice(index, 1);

              if (locations.length === 0) delete configuration.locations[provider];
            }
          }
        }

        setText();
        $scope.$broadcast('configurationModified', configuration);
      });

      $scope.$broadcast('configurationModified', configuration);
      setText();

      function setText() {
        $scope.configurationText = JSON.stringify($scope.configuration, null, '  ');
      }
    }]
  };
};