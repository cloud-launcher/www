module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.showCredentialCollector = {};

      $scope.selectLocation = (provider, name, location) => {
        $scope.$broadcast('locationModified', provider, name, location.selected);
      };
    }]
  };
};