const _ = require('lodash');

module.exports = ['$resource', $resource => {
  const registry = $resource('https://registry.hub.docker.com/v1/search?q=:query&n=:count&page=:page');
  return {
    restrict: 'E',
    template: require('./template.html'),
    link: ($scope, element, attributes) => {
      const input = element.find('input'),
            docker = {query: ''};

      $scope.docker = docker;
      $scope.selectedContainers = {};

      console.dir($scope.selectedContainers);

      $scope.queryChanged = $event => {
        const value = docker.query;
        debouncedSearch(value);

        docker.querying = true;
      };

      // Going to have issues with requests returning out-of-order...
      const debouncedSearch = _.debounce(query => {
        const result = registry.get({query, count: 100, page: 1} , () => {
          if (result.query != query) {
            console.log('didn\'t match', query, result.query);
            return;
          }

          const {num_pages, num_results, page, page_size, results} = result;

          docker.querying = false;
          docker.results = _.sortBy(results, 'star_count').reverse();
          docker.start = page * page_size - page_size + 1;
          docker.end = Math.min(docker.start + page_size - 1, num_results);
          docker.total = num_results;

          docker.showResults = query !== '';
        });
      }, 500);
    },
    controller: ['$scope', $scope => {

    }]
  };
}];