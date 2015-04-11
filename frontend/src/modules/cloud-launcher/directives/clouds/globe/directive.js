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

      $scope.$emit('globe ready');
    },
    controller: ['$scope', $scope => {

      $scope.showLocations = locations => {
        const points = _.map(locations, location => {
          const {lat, lon} = location;
          return [lat, lon + (lon < 0 ? (Math.PI / 12) : (-Math.PI / 12)), 0.5];
        });
        globe.clearPoints();

        const midpoint = calculateMidpoint(points);

        globe.setTarget(toRad(midpoint.lon), toRad(midpoint.lat));

        globe.addData(_.flatten(points), {format: 'magnitude'});
        globe.createPoints();
        globe.startAnimation();
      };

      function calculateMidpoint(points) {
        const unweighted =_.reduce(points, (average, point) => {
          const lat = toRad(point[0]),
                lon = toRad(point[1]);

          average.x += Math.cos(lat) * Math.cos(lon);
          average.y += Math.cos(lat) * Math.sin(lon);
          average.z += Math.sin(lat);

          return average;
        }, {x: 0, y: 0, z: 0});

        const numPoints = points.length;

        unweighted.x /= numPoints;
        unweighted.y /= numPoints;
        unweighted.z /= numPoints;

        const {x, y, z} = unweighted,
              lon = Math.atan2(y, x),
              hyp = Math.sqrt(x * x + y * y),
              lat = Math.atan2(z, hyp);

        return {lat: toDegrees(lat), lon: toDegrees(lon)};
      }

      function toRad(degrees) {
        return degrees * Math.PI / 180;
      }

      function toDegrees(rads) {
        return rads * 180 / Math.PI;
      }
    }]
  };
};