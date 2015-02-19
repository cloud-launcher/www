module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.providers = {
        digitalocean: {
          name: 'DigitalOcean',
          locations: {
            'sfo1': {vicinity: 'San Francisco'},
            'nyc3': {vicinity: 'New York'},
            'sgp1': {vicinity: 'Singapore'},
            'lon1': {vicinity: 'London'},
            'ams3': {vicinity: 'Amsterdam'}
          }
        },
        microsoft: {
          name: 'Microsoft',
          brand: 'Azure',
          comingsoon: true,
          locations: {
            'Central US': {vicinity: 'Iowa'},
            'East US': {vicinity: 'Virginia'},
            'East US 2': {vicinity: 'Virginia'},
            'US Gov Iowa': {vicinity: 'Iowa'},
            'US Gov Virginia': {vicinity: 'Virginia'},
            'North Central US': {vicinity: 'Illinois'},
            'South Central US': {vicinity: 'Texas'},
            'West US': {vicinity: 'California'},
            'North Europe': {vicinity: 'Ireland'},
            'West Europe': {vicinity: 'Netherlands'},
            'East Asia': {vicinity: 'Hong Kong'},
            'Southeast Asia': {vicinity: 'Singapore'},
            'Japan East': {vicinity: 'Saitama Prefecture'},
            'Japan West': {vicinity: 'Osaka Prefecture'},
            'Brazil South': {vicinity: 'Sao Paulo State'},
            'Austrailia East': {vicinity: 'New South Wales'},
            'Australia Southeast': {vicinity: 'Victoria'}
          }
        },
        google: {
          name: 'Google',
          brand: 'GCE',
          comingsoon: true,
          locations: {
            'us-central1-a': {vicinity: 'United States'},
            'us-central1-b': {vicinity: 'United States'},
            'us-central1-f': {vicinity: 'United States'},
            'europe-west1-c': {vicinity: 'Europe'},
            'asia-east1-a': {vicinity: 'Asia'},
            'asia-east1-b': {vicinity: 'Asia'},
            'asia-east1-c': {vicinity: 'Asia'}
          }
        },
        amazon: {
          name: 'Amazon',
          brand: 'AWS',
          comingsoon: true,
          locations: {
            'ap-northeast-1': {vicinity: 'Tokyo'},
            'ap-southeast-1': {vicinity: 'Singapore'},
            'ap-southeast-2': {vicinity: 'Sydney'},
            'eu-central-1': {vicinity: 'Frankfurt'},
            'eu-west-1': {vicinity: 'Ireland'},
            'sa-east-1': {vicinity: 'Sao Paulo'},
            'us-east-1': {vicinity: 'Northern Virginia'},
            'us-west-1': {vicinity: 'Northern California'},
            'us-west-2': {vicinity: 'Oregon'}
          }
        },
        rackspace: {
          name: 'Rackspace',
          comingsoon: true,
          locations: {
            'dfw': {vicinity: 'Dallas'},
            'ord': {vicinity: 'Chicago'},
            'iad': {vicinity: 'Northern Virginia'},
            'lon': {vicinity: 'London'},
            'syd': {vicinity: 'Sydney'},
            'hkg': {vicinity: 'Hong Kong'}
          }
        }
      };
    }]
  };
};