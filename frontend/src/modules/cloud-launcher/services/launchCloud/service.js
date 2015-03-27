var launchCloudBrowser = require('launch-cloud-browser'),
    launchCloudSimulator = require('launch-cloud-browser-simulator');

module.exports = () => {
  console.log(window.location.search);
  const providerConfigs = {},
        launchCloud = window.location.search === '?simulator' ? launchCloudSimulator(providerConfigs, (...args) => console.log(...args))
                                                             : launchCloudBrowser(providerConfigs, (...args) => console.log(...args));
console.log(launchCloud);
  return launchCloud;
};