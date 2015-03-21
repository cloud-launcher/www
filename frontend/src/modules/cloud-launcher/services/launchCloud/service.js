var launchCloudBrowser = require('launch-cloud-browser');

module.exports = () => {
  const providerConfigs = {},
        launchCloud = launchCloudBrowser(providerConfigs, (...args) => console.log(...args));

  return launchCloud;
};