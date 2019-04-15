// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = require('../../node_modules/pebblejs/dist/js/lib/ajax.js');
}

//requirePebble('lib/ajax');

const STATIONS_HOLDER = {};

function VelibStations() {

}

VelibStations.prototype.getStations = function () {
  const self = this;

  if (!STATIONS_HOLDER.stations) {

    var storedVelibStations = localStorage.getItem('velib-stations');
    if (storedVelibStations) {
      STATIONS_HOLDER.stations = JSON.parse(storedVelibStations);
    } else {
      const velibStations = require('./velib-stations.json');
      STATIONS_HOLDER.stations = {};
      velibStations.forEach(function (station) {
        STATIONS_HOLDER.stations[station.station.code] = station
      });
    }
  }
  return STATIONS_HOLDER.stations;

}

VelibStations.prototype.getState = function (code) {
  return this.getStations()[code];
};

VelibStations.prototype.refreshState = function (code, onSuccess, onError) {
  const self = this;
  const stations = this.getStations();
  const stationInfo = stations[code];
  if (!stationInfo) {
    return onError('unable to find station ' + code);
  }
  const gps = stationInfo.station.gps;
  ajax(
    {
      url: 'https://www.velib-metropole.fr/webapi/map/details' +
        '?gpsTopLatitude=' + (gps.latitude + 0.000001) +
        '&gpsTopLongitude=' + (gps.longitude + 0.000001) +
        '&gpsBotLatitude=' + (gps.latitude - 0.000001) +
        '&gpsBotLongitude=' + (gps.longitude - 0.000001) +
        '&zoomLevel=20',
      type: 'json'
    },
    function (data) {
      data.forEach(function (stationState) {
        stations[stationState.station.code] = stationState;
        if (stationState.station.code === code) {
          onSuccess(stationState);
        }
      });
    },
    function (err) {
      if (!err) {
        err = 'http call error';
      }
      console.log("error in velib api call:" + JSON.stringify(err));
      onError(err);
    }
  );

};

VelibStations.prototype.refresh = function (onSuccess, onError) {
  const self = this;
  const stations = this.getStations();
  ajax(
    {
      url: 'https://www.velib-metropole.fr/webapi/map/details' +
        '?gpsTopLatitude=49.007249184314254' +
        '&gpsTopLongitude=2.92510986328125' +
        '&gpsBotLatitude=48.75890477584505' +
        '&gpsBotLongitude=1.7832183837890627' +
        '&zoomLevel=11',
      type: 'json'
    },
    function (data) {
      data.forEach(function (station) {
        stations[station.station.code] = station;
      });
      localStorage.setItem('velib-stations', JSON.stringify(stations));
      onSuccess(stations);
    },
    function (err) {
      if (!err) {
        err = 'http call error';
      }
      console.log("error in refresh velib call call:" + JSON.stringify(err));
      onError(err);
    }
  );

};


module.exports = VelibStations;
