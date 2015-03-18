const _ = require('lodash');

module.exports = ['$timeout', 'launchCloud', ($timeout, launchCloud) => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.launch = () => {
        if (!$scope.configurationModified &&
            $scope.configurationOK) {

          $scope.launching = true;
          $scope.launchLog = [];
          $scope.launchStatus = 'Launching...';
          $scope.launchError = undefined;
          $scope.missingCredentials = undefined;

          const {configuration, providers} = $scope;
          const cloud = _.cloneDeep(configuration);

          $timeout(
            () =>
              launchCloud.launch(cloud, launchLog(cloud, providers))
               .then(something => {
                  console.log('launched', something);

                  $scope.$apply(() => {
                    $scope.launchStatus = 'Launched!';
                    // $scope.launching = false;
                  });
                })
               .catch(error => {
                  console.log('launch error', error);

                  if (error.type === 'Credentials') {
                    $scope.missingCredentials = error.missing;
                  }

                  $scope.$apply(() => {
                    $scope.launchStatus = 'Launch Error!';
                    $scope.launchError = error;
                  });
                }), 0);
        }
      };

      function launchLog(cloud, providers) {
        const status = {},
              handlers = {
                'Validate': handleValidation,
                'Generate': handleGeneratePlan,
                'Execute': handleExecutePlan
              };

        let indent = '';

        return (event) => {
          console.log(event);
          const {type} = event,
                handler = handlers[type];

          if (handler) handler(event);
          else $scope.launchLog.push({message: event.start});

          $scope.$apply();
        };

        function handleValidation(event) {
          const {start, ok, bad, args} = event;

          if (start) {
            if (start === 'Container') {
              let {containerName} = args[0];
              let entry = {
                message: `${indent}Checking if ${containerName} exists...`,
                event
              };
              status[start] = status[start] || {};
              status[start][containerName] = entry;
              $scope.launchLog.push(entry);
            }
            else {
              let entry = {
                message: `${indent}Validating ${start}...`,
                event
              };
              status[start] = entry;
              $scope.launchLog.push(entry);
              indent += '  ';
            }
          }
          else if (ok) {
            status[ok].status = 'ok';

            if (ok === 'Container') {
              let {containerName} = args[0];
              status['Container'][containerName].status = 'ok';
            }
            else {
              if (ok === 'Locations') {
                $scope.launchLog.push({message: `${indent}${args[0].status}`});
              }
              else if (ok === 'Credentials') {
                $scope.providerStatuses = _.mapValues(cloud.locations, (locations, providerName) => {
                  console.log(providers, providerName);
                  return providers[providerName].api.status;
                });
                console.log($scope.providerStatuses);
              }
              indent = indent.substr(0, Math.max(0, indent.length - 2));
            }
          }
          else if (bad) {
            status[bad].status = 'bad';

            if (bad === 'Credentials') {
              if (args[0].missing) {
                $scope.missingCredentials = args[0].missing;
              }
              else {
                $scope.missingCredentials = {};
                $scope.missingCredentials['digitalocean'] = [];
              }
            }
            if (bad === 'Container') {
              let {containerName} = args[0];
              status['Container'][containerName].status = 'bad';
            }

            indent = indent.substr(0, Math.max(0, indent.length - 2));
          }
        }

        function handleGeneratePlan(event) {
          const {start, ok, bad, args} = event;

          if (start) {
            if (start === 'Plan') {
              let entry = {
                message: `${indent}Generating Execution ${start}...`,
                event
              };
              status[start] = entry;
              $scope.launchLog.push(entry);
              indent += '  ';
            }
            else if (start === 'Clusters') {
              const {clusters} = args[0],
                    clusterCount = _.keys(clusters).length;

              let entry = {
                message: `${indent}Generating ${clusterCount} Cluster Plan${clusterCount > 1 ? 's' : ''}...`,
                event
              };
              status[start] = entry;
              $scope.launchLog.push(entry);
              indent += '  ';
            }
            else if (start === 'Cluster') {
              let {cluster} = args[0],
                  {machineCount, providerName, location} = cluster;

              providerName = providers[providerName].profile.name;

              let entry = {
                message: `${indent}${cluster.id} ${machineCount} Machine${machineCount > 1 ? 's' : ''} on ${providerName} at ${location}...`,
                event
              };
              status[start] = status[start] || {};
              status[start][cluster.id] = entry;
              $scope.launchLog.push(entry);
            }
          }
          else if (ok) {
            if (ok === 'Cluster') {
              let {cluster} = args[0];
              status[ok][cluster.id].status = 'ok';
            }
            else status[ok].status = 'ok';

            indent = indent.substr(0, Math.max(0, indent.length - 2));
          }
          else if (bad) {
            if (bad === 'Cluster') {
              let {cluster} = args[0];
              status[bad][cluster.id].status = 'bad';
            }
            else status[bad].status = 'bad';

            indent = indent.substr(0, Math.max(0, indent.length - 2));
          }
        }

        function handleExecutePlan(event) {
          const {start, ok, bad, args} = event;

          if (start) {
            if (start === 'Machine') {
              let {machine: {id}} = args[0];
              let entry = {
                message: `${indent}Launching Machine ${id}...`,
                event
              };
              status[start] = status[start] || {};
              status[start][id] = entry;
              $scope.launchLog.push(entry);
            }
            else {
              let entry = {
                message: `${indent}Executing ${start}...`,
                event
              };
              status[start] = entry;
              $scope.launchLog.push(entry);
              indent += '  ';
            }
          }
          else if (ok) {
            if (ok === 'Machine') {
              let {machine: {id}} = args[0];
              status[ok][id].status = 'ok';
            }
            else {
              status[ok].status = 'ok';

              indent = indent.substr(0, Math.max(0, indent.length - 2));
            }
          }
          else if (bad) {
            status[bad].status = 'bad';

            indent = indent.substr(0, Math.max(0, indent.length - 2));
          }
        }
      }
    }]
  };
}];