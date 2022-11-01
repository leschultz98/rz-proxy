/* apiElectron
  .doElectronAction({ action: 'getWindowStorageItem', payload: { key: 'connectedDevices' } })
  .then((connectingDevices) =>
    JSON.parse(connectingDevices)
      .map((data) => JSON.parse(data.value))
      .filter(({ setupStatus, powerStatus }) => !(setupStatus === 'ready' && powerStatus?.chargingStatus === 'off'))
  );
 */
/* apiElectron
  .doElectronAction({ action: 'getMemoryStorageItem', payload: { key: 'lighting-engine-chroma-devices' } })
  .then((devices) => {
    const { value } = JSON.parse(devices)[0];
    return JSON.parse(value).payload.devices.length;
  }); */
/* store
  .getState()
  .profile.items.map((item) => ({
    title: item.title,
    devices: item.devices.map((device) => ({ productName: device.productName, x: device.x, y: device.y })),
  })); */
/*
store.getState().device.items.map((device) => ({ productName: device.productName, x: device.x, y: device.y }));
*/
