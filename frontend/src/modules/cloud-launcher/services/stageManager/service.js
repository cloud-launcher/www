import _ from 'lodash';

module.exports = ['$rootScope', '$location', ($scope, $location) => {
  const states = {
    launchpad: 'launchpad',
    launchstatus: 'launchstatus',
    clouds: 'clouds'
  };

  // const states = {
  //   launchpad: {
  //     launchPadVisible: true,
  //     launchStatusVisible: false,
  //     cloudsVisible: false
  //   },
  //   launchstatus: {
  //     launchPadVisible: true,
  //     launchStatusVisible: true,
  //     cloudsVisible: false
  //   },
  //   clouds: {
  //     launchPadVisible: true,
  //     launchStatusVisible: false,
  //     cloudsVisible: true
  //   }
  // };

  const stage = {
    current: states.launchpad,
    launchPadVisible: true,
    launchStatusVisible: false,
    cloudsVisible: false
  };

  $scope.returnToLaunchpad = () => {
    stage.launching = false;
    stage.current = states.launchpad;
    stage.launchStatusVisible = false;
    stage.cloudsVisible = false;
  };

  $scope.toggleClouds = () => {
    if (stage.current === states.clouds) {
      stage.current = states.launchpad;
      stage.cloudsVisible = false;
    }
    else {
      stage.current = states.clouds;
      stage.cloudsVisible = true;
    }
  };

  $scope.gotoStage = newStage => {
    const {current: old} = stage;

    if (newStage === states.launchpad) {
      stage.current = states.launchpad;
      stage.launchPadVisible = true;
      stage.launchStatusVisible = false;
      stage.cloudsVisible = false;
    }
    else if (newStage === states.launchstatus) {
      stage.current = states.launchstatus;
      stage.launchPadVisible = true;
      stage.launchStatusVisible = true;
      stage.cloudsVisible = false;
    }
    else if (newStage === states.clouds) {
      stage.current = states.clouds;
      stage.launchPadVisible = true;
      // stage.launchStatusVisible = true;
      stage.cloudsVisible = true;
    }
    else throw new Error(`Unknown stage: ${newStage}`);

    stage.cameFrom = old;
  };

  $scope.$on('$locationChangeStart', ($event, newUrl, oldUrl) => {
    console.log($event, newUrl, oldUrl);
  });

  return {stage};
}];