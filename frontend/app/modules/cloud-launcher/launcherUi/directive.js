module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.providers = {
        digitalocean: {
          name: 'Digital Ocean',
          locations: [
            'sfo1',
            'nyc3',
            'sgp1',
            'lon1',
            'ams3'
          ]
        },
        microsoft: {
          name: 'Microsoft',
          brand: 'Azure',
          comingsoon: true,
          locations: [
            'Central US',
            'East US',
            'East US 2',
            'US Gov Iowa',
            'US Gov Virginia',
            'North Central US',
            'South Central US',
            'West US',
            'North Europe',
            'East Asia',
            'Southeast Asia',
            'Japan East',
            'Japan West',
            'Brazil South',
            'Austrailia East',
            'Australia Southeast'
          ]
        },
        google: {
          name: 'Google',
          brand: 'GCE',
          comingsoon: true,
          locations: [
            'us-central1:a',
            'us-central1:b',
            'us-central1:f',
            'europe-west1:b',
            'europe-west1:c',
            'asia-east1:a',
            'asia-east1:b',
            'asia-east1:c'
          ]
        },
        amazon: {
          name: 'Amazon',
          brand: 'AWS',
          comingsoon: true,
          locations: [
            'ap-northeast-1',
            'ap-southeast-1',
            'ap-southeast-2',
            'eu-central-1',
            'eu-west-1',
            'sa-east-1',
            'us-east-1',
            'us-west-1',
            'us-west-2'
          ]
        },
        rackspace: {
          name: 'Rackspace',
          comingsoon: true,
          locations: [
            'dfw',
            'ord',
            'iad',
            'lon',
            'syd',
            'hkg'
          ]
        }
      };
    }]
  };
};