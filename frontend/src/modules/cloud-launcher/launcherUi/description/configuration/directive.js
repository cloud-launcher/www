module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.configuration = JSON.stringify({
        domain: 'cloud-launcher.io',
        root: 'https://github.com/cloud-launcher',
        authorizations: ['40:85:f0:9b:28:ad:5d:25:b5:51:2e:ad:f3:b3:31:98'],
        locations: {
          digitalocean: ['sfo1']
        },
        configuration: {
          www: 1,
          api: 1,
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
      }, null, '  ');
    }]
  };
};