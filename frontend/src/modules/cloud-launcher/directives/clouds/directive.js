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

      $scope.destroyLog = {};
      $scope.destroyStatus = {};
      $scope.hideClusters = {};
      $scope.hideMachines = {};
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

        $scope.hideClusters[cloud.id] = false;
        $scope.destroyLog[cloud.id] = [];
        $scope.destroyStatus[cloud.id] = 'Destroying';

        launchCloud
          .destroy(cloud, destroyLog(cloud, providers))
          .then(
            cloud => {
              console.log('destroyed', cloud);
              storedClouds.removeCloud(cloud);

              if ($scope.clouds.length === 0) $scope.gotoStage('launchpad');

              delete $scope.destroyLog[cloud.id];

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

      $scope.getMachineProviderDashboardUrl = machine => {
        console.log(machine);
        return `http://cloud.digitalocean.com/droplets/${machine.providerData.id}`;
      };

      $scope.getMachineEstimatedCost = (cluster, machine) => {
        const now = new Date(),
              {createdAt, size} = machine,
              {provider} = cluster,
              {profile} = providers[provider],
              currentLife = Math.ceil((now - new Date(createdAt)) / 1000 / 60 / 60),
              estimatedCost = currentLife * profile.sizes[size].price_hourly;

        console.log(profile, currentLife, estimatedCost);

        return estimatedCost;
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

                _.merge(machine, machineUpdate);
              }
            });
          });
        });

        if (gotNew) {
          storedClouds.saveClouds();
          $scope.$apply();
        }
        else {
          const monitor = providerMonitor.cancel(providerName);
        }
      }

      function destroyLog(cloud, providers) {
        return event => {
          $scope.destroyLog[cloud.id].push(event);
        };
      }
    }]
  };
};