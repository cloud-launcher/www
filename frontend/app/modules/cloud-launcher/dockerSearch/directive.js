const _ = require('lodash');

module.exports = ['$resource', $resource => {
  const registry = $resource('https://registry.hub.docker.com/v1/search?q=:query&n=5');
  return {
    restrict: 'E',
    template: require('./template.html'),
    link: ($scope, element, attributes) => {
      const input = element.find('input');

      input.on('keydown', $event => {
        console.log($event, $scope);
        console.dir(input);
        debouncedSearch(input.val());
      });

      // Going to have issues with requests returning out-of-order...
      const debouncedSearch = _.debounce(query => {
        const result = registry.get({query} , () => {
          console.log(result);

          $scope.docker.querying = false;
          $scope.docker.results = result.results;
        });

        $scope.$apply(() => {$scope.docker.querying = true;});
      }, 250);

      $scope.docker = {};
    },
    controller: ['$scope', $scope => {

    }]
  };
}];