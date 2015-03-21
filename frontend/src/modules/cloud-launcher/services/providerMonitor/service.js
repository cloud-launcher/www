

module.exports = ['$interval', 'launchCloud', ($interval, launchCloud) => {
  const {providers} = launchCloud,
        currentMonitors = {};

  return {
    monitor,
    cancel
  };

  function monitor(providerName, intervalTime, callback) {
    let currentMonitor = currentMonitors[providerName];

    if (currentMonitor) {
      if (currentMonitor.intervalTime != intervalTime) {
        if ($interval.cancel(currentMonitor.interval)) {
          delete currentMonitor[providerName];
          monitor(providerName, intervalTime, callback);
        }
        else throw new Error('Failed to cancel interval');
      }
      else return currentMonitor;
    }
    else {
      const interval = $interval(() => listMachines(providerName), intervalTime);

      listMachines(providerName);

      currentMonitor = currentMonitors[providerName] = {
        interval,
        intervalTime,
        callback
      };

      return currentMonitor;
    }

    function listMachines(providerName) {
      const provider = providers[providerName],
            {api} = provider;

      api.listMachines()
         .then(machines => {
           console.log('machines', machines);
           const currentMonitor = currentMonitors[providerName];

           if (currentMonitor && currentMonitor.callback) callback(providerName, machines);
         });
    }
  }

  function cancel(providerName) {
    const currentMonitor = currentMonitors[providerName];

    if (currentMonitor) {
      if ($interval.cancel(currentMonitor.interval)) {
        delete currentMonitors[providerName];
      }
    }
  }
}];