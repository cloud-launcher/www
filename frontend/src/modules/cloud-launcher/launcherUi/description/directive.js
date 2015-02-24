const DOWrapper = require('do-wrapper-browser');

module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.launch = () => {
        const key = prompt('Enter DO key'),
              wrapper = new DOWrapper(key);

        console.log('wrapper', wrapper);

        wrapper.dropletsGetAll(function() {
          console.log(arguments);
        });
      };
    }]
  };
};