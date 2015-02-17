var angular = require('angular');


module.exports = {
  'base-angular': angular.module('base-angular', [])
    .directive('center', require('./modules/base-angular/center/directive'))
  ,
  'cloud-launcher': angular.module('cloud-launcher', ['base-angular'])
    .directive('teaser', require('./modules/cloud-launcher/teaser/directive'))
};