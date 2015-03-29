import _ from 'lodash';

const Globe = require('../../../lib/globe/globe');

module.exports = () => {
  let globe;

  return {
    restrict: 'E',
    // template: require('./template.html'),
    link: ($scope, element, attributes) => {
      globe = new Globe(element[0]);

      globe.startAnimation();

      $scope.$on('$destroy', () => {
        globe.destroy();
      });
    },
    controller: ['$scope', $scope => {
      $scope.showCloudPoints = cloud => {
        const {clusters} = cloud,
              locations = {};

        _.each(clusters, cluster => {
          const provider = locations[cluster.provider] = locations[cluster.provider] || {};

          provider[cluster.location] = true;
        });

        const {providers} = $scope,
              points = [];

        _.each(locations, (locations, provider) => {
          const profile = providers[provider].profile;

          _.each(locations, (exists, locationName) => {
            const location = profile.locations[locationName],
                  {physicalLocation} = location,
                  {lat, long} = physicalLocation;

            points.push([lat, long, 0.5]);
          });
        });

        globe.addData(_.flatten(points), {format: 'magnitude'});
        globe.createPoints();
        // globe.animate();

        console.log('showing', locations, points, providers);
      };
    }]
  };
};