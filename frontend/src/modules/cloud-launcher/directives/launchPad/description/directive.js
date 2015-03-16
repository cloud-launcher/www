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
                    $scope.launching = false;
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
                'Validation': handleValidation,
                'Generate Plan': handleGeneratePlan
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
            else if (ok === 'Container') {
              let {containerName} = args[0];
              status['Container'][containerName].status = 'ok';
            }
            indent = indent.substr(0, Math.max(0, indent.length - 2));
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
            if (start === 'Generation') {
              let entry = {
                message: `${indent}Generating Execution Plan...`,
                event
              };
              status[start] = entry;
              $scope.launchLog.push(entry);
              indent += '  ';
            }
            else if (start === 'Clusters') {
              let entry = {
                message: `${indent}Generating Cluster Plans...`,
                event
              };
              status[start] = entry;
              $scope.launchLog.push(entry);
              indent += '  ';

              const {clusters} = args[0],
                    clusterCount = _.keys(clusters).length;
              console.log(clusters);
              $scope.launchLog.push({message: `${indent}Will Generate ${clusterCount} Cluster Plan${clusterCount > 1 ? 's' : ''}:`});
              indent += '  ';
            }
            else if (start === 'Cluster') {
              let {cluster} = args[0];

              let entry = {
                message: `${indent}${cluster.id}`,
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
      }
    }]
  };
}];