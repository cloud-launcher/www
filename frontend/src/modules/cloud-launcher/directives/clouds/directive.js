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
        $scope.showDetails = {};
        $scope.clouds = clouds;

        console.log(clouds);

        $scope.$watchCollection('clouds', clouds => {
          const providers = _.unique(
                              _.flatten(
                                _.map(
                                  clouds,
                                  cloud => _.map(cloud.clusters, cluster => { return cluster.provider; }))));

          _.each(providers, provider => providerMonitor.monitor(provider, 15000, updateMachines));
        });

        let currentHoveredCloud;
        $scope.cloudHovered = cloud => {
          if (currentHoveredCloud != cloud) {
            currentHoveredCloud = cloud;

            $scope.showCloudPoints(cloud);
          }
        };

        $scope.cloudNotHovered = cloud => {
          if (currentHoveredCloud === cloud) {
            currentHoveredCloud = undefined;
          }
        };

        $scope.destroyCluster = cluster => {
          const {id} = cluster;
          console.log('destroying cluster', id);

          // launchCloud.destroy()
        };

        $scope.destroyCloud = cloud => {
          const {id} = cloud;

          $scope.hideClusters[cloud.id] = false;
          $scope.destroyLog[cloud.id] = [];
          $scope.destroyStatus[cloud.id] = 'Destroying';

          launchCloud
            .destroy(cloud, destroyLog(cloud, providers))
            .then(
              cloud => {
                console.log('destroyed', cloud);
                storedClouds.removeCloud(cloud);

                if ($scope.clouds.length === 0) $scope.stageManager.gotoStage('launchpad');

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

          if ($scope.clouds.length === 0) $scope.stageManager.gotoStage('launchpad');
        };

        $scope.returnToLaunchStatus = () => {
          $scope.gotoStage('launchstatus');
        };

        $scope.getMachineProviderDashboardUrl = machine => {
          return `http://cloud.digitalocean.com/droplets/${machine.providerData.id}`;
        };

        // Make a filter?
        $scope.getMachineAge = machine => {
          let age = currentAge(machine),
              [millisecondsTotal, milliseconds] = [age / 1000, Math.floor(age % 1000)],
              [secondsTotal, seconds] = [millisecondsTotal / 60, Math.floor(millisecondsTotal % 60)],
              [minutesTotal, minutes] = [secondsTotal / 60, Math.floor(secondsTotal % 60)],
              [hoursTotal, hours] = [minutesTotal / 60, Math.floor(minutesTotal % 60)],
              [daysTotal, days] = [hoursTotal / 24, Math.floor(hoursTotal % 24)],
              [yearsTotal, years] = [daysTotal / 365, Math.floor(daysTotal % 365)];

          return _.compact(
                  [
                    years > 0 ? `${years} years` : undefined,
                    days > 0 ? `${days} days` : undefined,
                    hours > 0 ? `${hours} hours` : undefined,
                    minutes > 0 ? `${minutes} minutes` : undefined,
                    seconds > 0 ? `${seconds} seconds` : undefined
                  ]
                 ).join(' ');
        };

        $scope.getMachineContainers = (cloud, machine) => {
          const {definition: {containers, roles}} = cloud,
                {roleName} = machine,
                machineContainers = _.pick(containers, (roles.$all || []).concat(roles[roleName] || []));

          return machineContainers;
        };

        $scope.getMachineEstimatedCost = (cluster, machine) => {
          const {createdAt, size} = machine,
                {provider} = cluster,
                {profile} = providers[provider],
                currentLife = Math.ceil(currentAge(machine) / 1000 / 60 / 60),
                estimatedCost = currentLife * profile.sizes[size].price_hourly;

          return estimatedCost;
        };

        function currentAge(machine) {
          const now = new Date(),
                {createdAt} = machine,
                age = now - new Date(createdAt);

          return age;
        }

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
          return (...args) => {
            if (args && args.length === 1) {
              const [event] = args;
              $scope.destroyLog[cloud.id].push(event);
            }
            else console.log(...args);
          };
        }
      }
    ]
  };
};