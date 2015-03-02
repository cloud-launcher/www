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

      $scope.queryChanged = $event => {
        const value = docker.query;

        docker.haveFirstResults = false;

        if (value !== '') {
          debouncedSearch(value);
          docker.querying = true;
        }
        else {
          docker.querying = false;
          docker.showResults = false;
        }
      };

      $scope.selectContainer = name => {
        $scope.$broadcast('containerModified', name, $scope.selectedContainers[name]);
      };

      // Going to have issues with requests returning out-of-order...
      const debouncedSearch = _.debounce(query => {
        const result = registry.get({query, count: 1000, page: 1} , () => {
          if (result.query != query) {
            console.log('didn\'t match', query, result.query);
            return;
          }

          const {num_pages, num_results, page, page_size, results} = result;

          docker.haveFirstResults = true;
          docker.querying = false;
          docker.results = _.sortBy(results, 'star_count').reverse();
          docker.page = 1;
          docker.start = page * page_size - page_size + 1;
          docker.end = Math.min(docker.start + page_size - 1, num_results);
          docker.end = docker.results.length;
          docker.total = num_results;

          docker.showResults = query !== '';

          docker.resultsLoaded = docker.results.length / num_results * 100;

          // if (num_results > docker.results.length) loadRestOfResults(docker);
        });
      }, 500);

      function loadRestOfResults(docker) {
        let {query, page} = docker;
        docker.querying = true;

        page += 1;

        const result = registry.get({query, count: 100, page}, () => {
          if (result.query != query) {
            console.log('didn\'t match', query, result.query);
            return;
          }

          const {num_pages, num_results, page_size, results} = result;

          docker.page = page;

          docker.results.splice(0, 0, ...results);
          docker.results = _.sortBy(docker.results, 'star_count').reverse();
          //docker.results = _.sortBy(docker.results.concat(results), 'star_count').reverse();

          docker.end = docker.results.length;
          docker.total = num_results;

          docker.resultsLoaded = docker.results.length / num_results * 100;

          if (num_results > docker.results.length) {
            loadRestOfResults(docker);
          }
          else {
            docker.querying = false;
          }
        });
      }
    },
    controller: ['$scope', $scope => {

    }]
  };
}];