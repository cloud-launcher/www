var angular = require('angular');


module.exports = {
  'cloud-launcher': angular.module('cloud-launcher', ['ngResource'])
    .directive('dockerSearch', require('./modules/cloud-launcher/dockerSearch/directive'))
    .directive('launcherUi', require('./modules/cloud-launcher/launcherUi/directive'))
    // .directive('teaser', require('./modules/cloud-launcher/teaser/directive'))
};