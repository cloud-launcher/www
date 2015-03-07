module.exports = ['localStorageService', localStorage => {
  return {
    getCredentials,
    setCredentials
  };

  function getCredentials(providerName) {
    return localStorage.get(getKeyName(providerName));
  }

  function setCredentials(providerName, saveCredentials, credentials) {
    const keyName = getKeyName(providerName);
    localStorage.set(keyName, {saveCredentials, credentials});
  }

  function getKeyName(providerName) {
    return 'credentials.' + providerName;
  }
}];