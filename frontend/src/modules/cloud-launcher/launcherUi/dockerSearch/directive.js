const _ = require('lodash');

module.exports = ['$resource', $resource => {
  const registry = $resource('https://registry.hub.docker.com/v1/search?q=:query&n=:count&page=:page');
  return {
    restrict: 'E',
    template: require('./template.html'),
    link: ($scope, element, attributes) => {
      const input = element.find('input'),
            docker = {query: '', results: [], sortBy: 'stars', sortFn: sortFns.stars};

      $scope.docker = docker;
      $scope.selectedContainers = {};

      $scope.queryChanged = $event => {
        const value = docker.query;

        docker.querying = false;
        docker.haveFirstResults = false;
        docker.page = 0;
        docker.start = 0;
        docker.end = 0;
        docker.total = 0;
        docker.resultsLoaded = 0;
        docker.results.splice(0, docker.results.length);

        if (value !== '') {
          debouncedSearch(value);
          // docker.querying = true;
        }
        else {
          docker.querying = false;
          docker.showResults = false;
        }
      };

      $scope.sortBy = () => {
        switch (docker.sortBy) {
          case 'stars':
            docker.sortFn = sortFns.stars;
            break;
          case 'name':
            docker.sortFn = sortFns.name;
            break;
        }
        docker.results.sort(docker.sortFn);
      };

      $scope.selectContainer = name => {
        $scope.$broadcast('containerModified', name, $scope.selectedContainers[name]);
      };

      // Going to have issues with requests returning out-of-order...
      const debouncedSearch = _.debounce(query => {
        docker.querying = true;

        const result = registry.get({query, count: 1000, page: 1} , () => {
          if (result.query != docker.query) {
            console.log('didn\'t match', query, result.query);
            return;
          }

          const {num_pages, num_results, page, page_size, results} = result;

          docker.haveFirstResults = true;
          docker.querying = false;
          docker.results.splice(0, 0, ...results);
          docker.results.sort(docker.sortFn);
          docker.page = 1;
          docker.start = page * page_size - page_size + 1;
          docker.end = Math.min(docker.start + page_size - 1, num_results);
          docker.end = docker.results.length;
          docker.total = num_results;

          docker.showResults = query !== '';

          docker.resultsLoaded = docker.results.length / num_results * 100;

          if (num_results > docker.results.length) loadRestOfResults(docker);
        });
      }, 500);

      function loadRestOfResults(docker) {
        let {query, page} = docker;
        console.log('query', query);
        docker.querying = true;

        page += 1;

        const result = registry.get({query, count: 100, page}, () => {
          console.log('returned', result.query, 'actual query', docker.query);
          if (result.query != docker.query) {
            console.log('didn\'t match', query, result.query);
            return;
          }

          const {num_pages, num_results, page_size, results} = result;

          docker.page = page;

          docker.results.splice(0, 0, ...results);
          docker.results.sort(docker.sortFn);

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

const sortFns = {
  stars: (x, y) => {
    if (x.star_count < y.star_count) return 1;
    else return -1;
  },
  name: (x, y) => {
    if (x.name < y.name) return -1;
    else return 1;
  }
};