// We don't want everyone to be synchronized, so add a random amount to the interval
const NEW_VERSION_INTERVAL = (10 + Math.random() * 5) * 60 * 1000;
module.exports = ['$interval', '$http', '$rootScope', ($interval, $http, $rootScope) => {
  let ignoreNewVersion = false;

  $rootScope.ignoreNewVersion = () => {
    ignoreNewVersion = true;
    $rootScope.newVersionAvailable = false;
    $interval.cancel(versionCheck);
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
}];