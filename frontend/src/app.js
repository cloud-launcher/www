require('angular'); // Don't assign result...angular/browserify doesn't like it...
require('angular-animate');
require('angular-resource');
require('angular-local-storage');

module.exports = {
  'cloud-launcher': angular.module('cloud-launcher', ['ngAnimate', 'ngResource', 'LocalStorageModule'])
    .service('launchCloud',               require('./modules/cloud-launcher/services/launchCloud/service'))
    .service('newVersionCheck',           require('./modules/cloud-launcher/services/newVersionCheck/service'))
    .service('storedCredentials',         require('./modules/cloud-launcher/services/storedCredentials/service'))

    .directive('launchPad',               require('./modules/cloud-launcher/directives/launchPad/directive'))
      .directive('description',           require('./modules/cloud-launcher/directives/launchPad/description/directive'))
        .directive('configuration',       require('./modules/cloud-launcher/directives/launchPad/description/configuration/directive'))
        .directive('cost',                require('./modules/cloud-launcher/directives/launchPad/description/cost/directive'))
        .directive('target',              require('./modules/cloud-launcher/directives/launchPad/description/target/directive'))
      .directive('dockerSearch',          require('./modules/cloud-launcher/directives/launchPad/dockerSearch/directive'))
      .directive('launch',                require('./modules/cloud-launcher/directives/launchPad/launch/directive'))
      .directive('providers',             require('./modules/cloud-launcher/directives/launchPad/providers/directive'))
        .directive('credentialCollector', require('./modules/cloud-launcher/directives/launchPad/providers/credentialCollector/directive'))

    .directive('launchStatus',            require('./modules/cloud-launcher/directives/launchStatus/directive'))

    // .value('dockerHubApiRoots', ['https://index.docker.io', 'http://localhost:3408'])
    .value('dockerHubApiRoot', 'http://localhost:3408')
};
