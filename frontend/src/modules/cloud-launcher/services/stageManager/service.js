import _ from 'lodash';

module.exports = () => {
  const states = {
    clouds: 'clouds',
    launchpad: 'launchpad',
    launchstatus: 'launchstatus'
  };

  const stage = {
    current: states.launchpad,
    cloudsVisible: false,
    launchPadVisible: true,
    launchStatusVisible: false
  };

  function toggleClouds() {
    gotoStage(stage.current === states.clouds ? states.launchpad : states.clouds);
  }

  function gotoStage(newStage) {
    const {current: old} = stage;

    if (newStage === states.launchpad) {
      stage.current = states.launchpad;
      stage.cloudsVisible = false;
      stage.launchPadVisible = true;
      stage.launchStatusVisible = false;
    }
    else if (newStage === states.launchstatus) {
      stage.current = states.launchstatus;
      stage.cloudsVisible = false;
      stage.launchPadVisible = true;
      stage.launchStatusVisible = true;
    }
    else if (newStage === states.clouds) {
      stage.current = states.clouds;
      stage.cloudsVisible = true;
      stage.launchPadVisible = true;
      stage.launchStatusVisible = old === states.launchstatus;
    }
    else throw new Error(`Unknown stage: ${newStage}`);

    stage.cameFrom = old;
  }

  return {stage, toggleClouds, gotoStage};
};