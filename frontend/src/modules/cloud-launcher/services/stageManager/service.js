import _ from 'lodash';

module.exports = () => {
  const states = {
    about: 'about',
    clouds: 'clouds',
    launchpad: 'launchpad',
    launchstatus: 'launchstatus'
  };

  const stage = {
    current: states.launchpad,
    cameFrom: states.launchpad,
    aboutVisible: false,
    cloudsVisible: false,
    launchPadVisible: true,
    launchStatusVisible: false
  };

  function toggleClouds() {
    gotoStage(stage.current === states.clouds ? states.launchpad : states.clouds);
  }

  function toggleAbout() {
    gotoStage(stage.current === states.about ? stage.cameFrom : states.about);
  }

  function gotoStage(newStage) {
    const {current: old} = stage;

    if (newStage === states.about) {
      stage.aboutVisible = true;
    }
    else if (newStage === states.launchpad) {
      stage.aboutVisible = false;
      stage.cloudsVisible = false;
      stage.launchPadVisible = true;
      stage.launchStatusVisible = false;
    }
    else if (newStage === states.launchstatus) {
      stage.aboutVisible = false;
      stage.cloudsVisible = false;
      stage.launchPadVisible = true;
      stage.launchStatusVisible = true;
    }
    else if (newStage === states.clouds) {
      stage.aboutVisible = false;
      stage.cloudsVisible = true;
      stage.launchPadVisible = true;
      stage.launchStatusVisible = old === states.launchstatus;
    }
    else throw new Error(`Unknown stage: ${newStage}`);

    stage.current = newStage;

    stage.cameFrom = old;
  }

  return {stage, toggleClouds, toggleAbout, gotoStage};
};