const HJSON = require('hjson');

module.exports = [
  '$rootScope', '$location', '$http',
  ($scope, $location, $http) => {
    $scope.$on('$locationChangeSuccess', () => {
      const matches = $location.path().match(/^\/config=(.*)$/);

      if (matches.length > 0) {
        const [path, repo] = matches;

        let cloudFile = repo.endsWith('json') ? repo : (repo + '/master/cloud.hjson');

        $http.get('https://github-raw-cors-proxy.herokuapp.com/' + cloudFile)
             .success((data, status, headers, config) => {
               console.log(data, status, headers, config);
               if (status === 200) {
                 $scope.setConfiguration(HJSON.parse(data));
               }
             });
      }
    });
  }
];