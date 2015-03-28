module.exports = [
  'localStorageService',
  localStorage => {
    const keyName = 'savedConfiguration';

    return {
      getConfiguration,
      saveConfiguration,
      removeConfiguration
    };

    function getConfiguration() {
      return localStorage.get(keyName);
    }

    function saveConfiguration(configuration) {
      localStorage.set(keyName, configuration);
    }

    function removeConfiguration() {
      localStorage.set(keyName, undefined);
    }
  }
];