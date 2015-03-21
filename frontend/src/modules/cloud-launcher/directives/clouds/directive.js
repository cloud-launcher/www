import _ from 'lodash';

module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: [
    '$scope', 'launchCloud', 'providerMonitor', 'storedClouds',
    ($scope, launchCloud, providerMonitor, storedClouds) => {
      const {providers} = launchCloud,
            clouds = storedClouds.getClouds();

      $scope.showClusters = {};
      $scope.clouds = clouds;

      $scope.$watchCollection('clouds', clouds => {
        console.log(clouds);
        const providers = _.unique(
                            _.flatten(
                              _.map(
                                clouds,
                                cloud => _.map(cloud.clusters, cluster => { return cluster.provider; }))));


        console.log(providers);

        _.each(providers, provider => providerMonitor.monitor(provider, 15000, updateMachines));
      });

      $scope.destroyCluster = cluster => {
        const {id} = cluster;
        console.log('destroying cluster', id);

        // launchCloud.destroy()
      };

      $scope.destroyCloud = cloud => {
        const {id} = cloud;
        console.log('destroying cloud', id);

        launchCloud
          .destroy(cloud, destroyLog(cloud, providers))
          .then(
            cloud => {
              console.log('destroyed', cloud);
              storedClouds.removeCloud(cloud);

              if ($scope.clouds.length === 0) $scope.gotoStage('launchpad');

              $scope.$apply();
            },
            error => {
              console.log('error destroying', error);
            }
          );
      };

      $scope.forgetCloud = cloud => {
        storedClouds.removeCloud(cloud);

        if ($scope.clouds.length === 0) $scope.gotoStage('launchpad');
      };

      $scope.returnToLaunchStatus = () => {
        $scope.gotoStage('launchstatus');
      };

      function updateMachines(providerName, machines) {
        let gotNew = false;

        _.each(clouds, cloud => {
          _.each(cloud.clusters, cluster => {
            _.each(cluster.machines, (machine, id) => {
              const machineUpdate = machines[id];

              if (!_.matches(machineUpdate)(machine.providerData)) {
                gotNew = true;
                machine.providerData = machineUpdate;
              }
            });
          });
        });
        if (gotNew) $scope.$apply();
        else {
          const monitor = providerMonitor.cancel(providerName);
        }
      }

      function destroyLog(cloud, providers) {
        return event => {
          console.log(event);
        };
      }
    }]
  };
};