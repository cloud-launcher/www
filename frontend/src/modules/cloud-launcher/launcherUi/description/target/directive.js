module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.targets = {
        'CoreOS': {
          'Stable': '557.2.0',
          'Beta': '584.0.0',
          'Alpha': '598.0.0'
        }
      };

      $scope.selectedTarget = {'CoreOS': 'Alpha'};
    }]
  };
};