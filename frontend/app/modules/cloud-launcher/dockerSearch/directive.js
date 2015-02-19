const _ = require('lodash');

module.exports = ['$resource', $resource => {
  const registry = $resource('https://registry.hub.docker.com/v1/search?q=:query&n=10');
  return {
    restrict: 'E',
    template: require('./template.html'),
    link: ($scope, element, attributes) => {
      const input = element.find('input');

      input.on('keyup', $event => {
        const value = input.val();
        debouncedSearch(value);

        $scope.$apply(() => {
          $scope.docker.querying = true;
        });
      });

      // Going to have issues with requests returning out-of-order...
      const debouncedSearch = _.debounce(query => {
        const result = registry.get({query} , () => {
          console.log(result);

          $scope.docker.querying = false;
          $scope.docker.results = _.sortBy(result.results, 'star_count').reverse();

          $scope.docker.showResults = query !== '';
        });
      }, 500);

      $scope.docker = {};
    },
    controller: ['$scope', $scope => {

    }]
  };
}];