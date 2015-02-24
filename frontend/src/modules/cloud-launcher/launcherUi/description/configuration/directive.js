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
          digitalocean: ['sfo1', 'lon1'],
          amazon: ['ap-northeast-1']
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
        $scope.$broadcast('configurationModified', configuration);
        setText();
      });

      $scope.$broadcast('configurationModified', configuration);
      setText();

      function setText() {
        $scope.configurationText = JSON.stringify($scope.configuration, null, '  ');
      }
    }]
  };
};