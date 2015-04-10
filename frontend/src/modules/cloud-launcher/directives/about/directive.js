module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    scope: {},
    controller: ['$scope', $scope => {
      $scope.toggle = panel => {
        if ($scope.selectedCopy === panel) $scope.selectedCopy = undefined;
        else $scope.selectedCopy = panel;
      };
    }]
  };
};