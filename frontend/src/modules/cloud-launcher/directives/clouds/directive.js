import _ from 'lodash';

module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    scope: true,
    controller: [
      '$scope', 'launchCloud', 'providerMonitor', 'storedClouds', 'stageManager',
      ($scope, launchCloud, providerMonitor, storedClouds, stageManager) => {
        const {providers} = launchCloud,
              clouds = storedClouds.getClouds();

        $scope.$on('globe ready', () => $scope.showLocations(getAllLocations()));

        _.extend($scope, {
          destroyLog: {},
          destroyStatus: {},
          showDestroyConfirmation: {},
          showForgetConfirmation: {},
          showWarning: {},
          showClusters: {},
          showMachines: {},
          showDetails: {},
          clouds,
          stageManager
        });

        $scope.$watchCollection('clouds', clouds => {
          const providers = _.unique(
                              _.flatten(
                                _.map(
                                  clouds,
                                  cloud => _.map(cloud.clusters, cluster => { return cluster.provider; }))));

          _.each(providers, provider => providerMonitor.monitor(provider, 15000, updateMachines));

          _.each(clouds, cloud => {
            const {id, clusterCount, clusters} = cloud;

            if (clusterCount < 4) {
              $scope.showClusters[id] = true;

              _.each(clusters, cluster => {
                const {id, machineCount, machines} = cluster;

                if (machineCount < 3) {
                  $scope.showMachines[id] = true;

                  _.each(machines, (machine, id) => {
                    $scope.showDetails[id] = true;
                  });
                }
              });
            }
          });
        });

        let currentHoveredCloud;
        $scope.cloudHovered = cloud => {
          if (currentHoveredCloud != cloud) {
            currentHoveredCloud = cloud;

            $scope.showLocations(getLocations(cloud));
          }
        };

        $scope.cloudNotHovered = cloud => {
          if (currentHoveredCloud === cloud) {
            currentHoveredCloud = undefined;
          }

          $scope.showLocations(getAllLocations());
        };

        $scope.destroyCluster = cluster => {
          const {id} = cluster;
          console.log('destroying cluster', id);

          // launchCloud.destroy()
        };

        $scope.destroyCloud = cloud => {
          const {id} = cloud;

          $scope.showClusters[cloud.id] = true;
          $scope.destroyLog[cloud.id] = [];
          $scope.destroyStatus[cloud.id] = 'Destroying';

          launchCloud
            .destroy(cloud, destroyLog(cloud, providers))
            .then(
              cloud => {
                console.log('destroyed', cloud);
                storedClouds.removeCloud(cloud);

                if ($scope.clouds.length === 0) stageManager.gotoStage('launchpad');

                delete $scope.destroyLog[cloud.id];
                delete $scope.showClusters[cloud.id];

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
              secondsTotal = age / 1000,
              [minutesTotal, seconds] = [secondsTotal / 60, Math.floor(secondsTotal % 60)],
              [hoursTotal, minutes] = [minutesTotal / 60, Math.floor(minutesTotal % 60)],
              [daysTotal, hours] = [hoursTotal / 24, Math.floor(hoursTotal % 24)],
              [years, days] = [Math.floor(daysTotal / 365), Math.floor(daysTotal % 365)]; // won't handle leap years

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

        function getLocations(cloud) {
          const {clusters} = cloud;

          const locations = _.map(clusters, cluster => {
            const {provider, location} = cluster,
                  {profile} = providers[provider],
                  {locations} = profile,
                  {physicalLocation} = locations[location];

            return physicalLocation;
          });

          return locations;
        }

        function getAllLocations() {
          return _.flatten(_.map(clouds, getLocations));
        }

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