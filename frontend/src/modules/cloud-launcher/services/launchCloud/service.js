var launchCloudBrowser = require('launch-cloud-browser');

module.exports = () => {
  const providerConfigs = {},
        api = launchCloudBrowser(providerConfigs, (...args) => console.log(...args));

  return api;
};