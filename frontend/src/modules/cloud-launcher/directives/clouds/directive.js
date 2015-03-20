module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: [
    '$scope', 'launchCloud', 'storedClouds',
    ($scope, launchCloud, storedClouds) => {
      const {providers} = launchCloud;

      $scope.showClusters = {};
      $scope.clouds = storedClouds.getClouds();

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

      function destroyLog(cloud, providers) {
        return event => {
          console.log(event);
        };
      }
    }]
  };
};