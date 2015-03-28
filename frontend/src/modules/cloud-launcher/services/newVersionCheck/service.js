// We don't want everyone to be synchronized, so add a random amount to the interval
const NEW_VERSION_INTERVAL = (10 + Math.random() * 5) * 60 * 1000;
// const NEW_VERSION_INTERVAL = 5000; // For debuggins
module.exports = [
  '$interval', '$http', '$rootScope', 'storedConfiguration',
  ($interval, $http, $rootScope, storedConfiguration) => {
    let ignoreNewVersion = false;

    $rootScope.ignoreNewVersion = () => {
      ignoreNewVersion = true;
      $rootScope.newVersionAvailable = false;
      $interval.cancel(versionCheck);
    };

    $rootScope.loadNewVersion = () => {
      const {configuration} = $rootScope;
      storedConfiguration.saveConfiguration(configuration);
      window.location.search = 'cacheBust';
    };

    let versionCheck = $interval(checkForNewVersion, NEW_VERSION_INTERVAL);

    function checkForNewVersion() {
      $http
        .get('currentVersion?' + new Date().getTime())
          .success(version => {
            // clVersion is generate at build time and injected into index.html
            // it is a global value!
            $rootScope.newVersionAvailable = !ignoreNewVersion && clVersion != version;
          })
          .error(error => {

          });
    }
  }
];