require('angular'); // Don't assign result...angular/browserify doesn't like it...
require('angular-animate');
require('angular-resource');
require('angular-local-storage');

module.exports = {
  'cloud-launcher': angular.module('cloud-launcher', ['ngAnimate', 'ngResource', 'LocalStorageModule'])
    .service('newVersionCheck',           require('./modules/cloud-launcher/newVersionCheck/service'))
    .service('storedCredentials',         require('./modules/cloud-launcher/storedCredentials/service'))

    .directive('launcherUi',              require('./modules/cloud-launcher/launcherUi/directive'))
      .directive('description',           require('./modules/cloud-launcher/launcherUi/description/directive'))
        .directive('configuration',       require('./modules/cloud-launcher/launcherUi/description/configuration/directive'))
        .directive('cost',                require('./modules/cloud-launcher/launcherUi/description/cost/directive'))
        .directive('target',              require('./modules/cloud-launcher/launcherUi/description/target/directive'))
      .directive('dockerSearch',          require('./modules/cloud-launcher/launcherUi/dockerSearch/directive'))
      .directive('launch',                require('./modules/cloud-launcher/launcherUi/launch/directive'))
      .directive('providers',             require('./modules/cloud-launcher/launcherUi/providers/directive'))
        .directive('credentialCollector', require('./modules/cloud-launcher/launcherUi/providers/credentialCollector/directive'))

    // .value('dockerHubApiRoots', ['https://index.docker.io', 'http://localhost:3408'])
    .value('dockerHubApiRoot', 'http://localhost:3408')
};
