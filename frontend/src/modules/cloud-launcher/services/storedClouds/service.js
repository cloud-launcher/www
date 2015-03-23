import _ from 'lodash';

module.exports = ['localStorageService', localStorage => {
  const keyName = 'clouds',
        clouds = localStorage.get(keyName) || [];

  return {
    getClouds,
    addCloud,
    removeCloud,
    saveClouds
  };

  function getClouds() {
    return clouds;
  }

  function addCloud(cloud) {
    clouds.push(cloud);
    localStorage.set(keyName, clouds);
  }

  function removeCloud(cloud) {
    const {id} = cloud,
          index = _.findIndex(clouds, cloud => { return id === cloud.id; });

    if (index >= 0) {
      clouds.splice(index, 1);
      localStorage.set(keyName, clouds);
    }
  }

  // There's a more efficient way to store these
  // Store a list of cloud ids
  // Store each cloud independently, key'd by id
  function saveClouds() {
    localStorage.set(keyName, clouds);
  }
}];