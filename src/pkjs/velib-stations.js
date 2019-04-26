// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = require('../../node_modules/pebblejs/dist/js/lib/ajax.js');
}
const geolib = require('geolib');
// global holder for all stations
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

VelibStations.prototype.buildPositionRectangle = function (position, distance) {
  return {
    topLatitude: position.latitude + distance,
    topLongitude: position.longitude + distance,
    bottomLatitude: position.latitude - distance,
    bottomLongitude: position.longitude - distance,
  }
};

VelibStations.prototype.getStationStates = function (positionRectangle, onSuccess, onError) {
  const self = this;
  const stations = self.getStations();

  var velibStationUrl = 'https://www.velib-metropole.fr/webapi/map/details' +
    '?gpsTopLatitude=' + positionRectangle.topLatitude +
    '&gpsTopLongitude=' + positionRectangle.topLongitude +
    '&gpsBotLatitude=' + positionRectangle.bottomLatitude +
    '&gpsBotLongitude=' + positionRectangle.bottomLongitude +
    '&zoomLevel=20';
  console.log('calling url: ' + velibStationUrl);
  ajax(
    {
      url: velibStationUrl,
      type: 'json'
    },
    function (data) {
      data.forEach(function (stationState) {
        stations[stationState.station.code] = stationState;
      });
      onSuccess(data);
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


VelibStations.prototype.getClosestStations = function (position, onSuccess, onError) {
  const self = this;
  console.log('getting stations close from ' + JSON.stringify(position));
  self.getStationStates(self.buildPositionRectangle(position, 0.01),
    function (data) {
      var sorted = data
        .filter(function (stationState) {
          return stationState.station.state === 'Operative';
        })
        .sort(function (a, b) {
          a.distance = a.distance || geolib.getDistance(position, a.station.gps, 1);
          b.distance = b.distance || geolib.getDistance(position, b.station.gps, 1);
          return a.distance - b.distance;
        });


      var closestStations = sorted.slice(0, 10);

      onSuccess(closestStations);
    },
    onError);

}

VelibStations.prototype.refreshState = function (code, onSuccess, onError) {
  const self = this;
  const stations = this.getStations();
  const stationInfo = stations[code];
  if (!stationInfo) {
    return onError('unable to find station ' + code);
  }
  const gps = stationInfo.station.gps;
  self.getStationStates(self.buildPositionRectangle(gps, 0.000001),
    function (data) {
      data.forEach(function (stationState) {
        if (stationState.station.code === code) {
          onSuccess(stationState);
        }
      });
    },
    onError);
  };

VelibStations.prototype.refresh = function (onSuccess, onError) {
  const self = this;
  const stations = this.getStations();
  self.getStationStates({
        topLatitude:49.007249184314254,
        topLongitude:2.92510986328125,
        bottomLatitude:48.75890477584505,
        bottomLongitude:1.7832183837890627
      // '&zoomLevel=11',
    },
    function (data) {
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
