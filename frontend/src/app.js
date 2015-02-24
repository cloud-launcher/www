require('angular'); // Don't assign result...angular/browserify doesn't like it...
require('angular-resource');

module.exports = {
  'cloud-launcher': angular.module('cloud-launcher', ['ngResource'])
    .directive('launcherUi',      require('./modules/cloud-launcher/launcherUi/directive'))

      .directive('description',       require('./modules/cloud-launcher/launcherUi/description/directive'))
        .directive('target',          require('./modules/cloud-launcher/launcherUi/description/target/directive'))
        .directive('configuration',   require('./modules/cloud-launcher/launcherUi/description/configuration/directive'))
        .directive('cost',            require('./modules/cloud-launcher/launcherUi/description/cost/directive'))
      .directive('dockerSearch',      require('./modules/cloud-launcher/launcherUi/dockerSearch/directive'))
      .directive('launch',            require('./modules/cloud-launcher/launcherUi/launch/directive'))
      .directive('providers',         require('./modules/cloud-launcher/launcherUi/providers/directive'))
    // .directive('teaser', require('./modules/cloud-launcher/teaser/directive'))
};
