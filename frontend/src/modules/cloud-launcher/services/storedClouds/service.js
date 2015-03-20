import _ from 'lodash';

module.exports = ['localStorageService', localStorage => {
  const keyName = 'clouds',
        clouds = localStorage.get(keyName) || [];

  return {
    getClouds,
    addCloud,
    removeCloud
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
}];