const VelibStations = require('./velib-stations.js');

function VelibStationInfo(station) {
  console.log('init VelibStationInfo: ' + JSON.stringify(station));
  this.station = station;
}

VelibStationInfo.prototype.getStation = function() {
  return this.station;
};

VelibStationInfo.prototype.getState = function() {
  return new VelibStations().getState(this.station.code);
};

VelibStationInfo.prototype.refresh = function(onSuccess, onError) {
  new VelibStations().refreshState(this.station.code, onSuccess, onError);
};


module.exports = VelibStationInfo;
