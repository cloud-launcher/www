require('angular'); // Don't assign result...angular/browserify doesn't like it...
require('angular-resource');

module.exports = {
  'cloud-launcher': angular.module('cloud-launcher', ['ngResource'])
    .directive('launcherUi', require('./modules/cloud-launcher/launcherUi/directive'))
      .directive('dockerSearch', require('./modules/cloud-launcher/launcherUi/dockerSearch/directive'))
    // .directive('teaser', require('./modules/cloud-launcher/teaser/directive'))
};
