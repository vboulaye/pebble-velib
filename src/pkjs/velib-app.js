const VelibStationInfo = require('./velib-station-info.js');
const VelibCardWindow = require('./velib-card-window.js');
const VelibStations = require('./velib-stations.js');


function buildCards(stations, velibCardWindow) {
  return stations.map(function (station) {
    const info = new VelibStationInfo(station);
    info.show = function () {
      velibCardWindow.show();
      velibCardWindow.refresh(info);
      info.refresh(function (data) {
          velibCardWindow.refresh(info);
        }, function (err) {
          velibCardWindow.error(err);
        }
      );
    };
    return info;
  });
}

function VelibApp() {
  const self = this;
  self.velibCardWindow = new VelibCardWindow();

  var STATIONS = [
    {code: '13055', label: 'BFM-Frigo'},
    {code: '13053', label: 'BFM-Bas'},
    {code: '13052', label: 'BFM-Leredde'},
    {code: '13036', label: 'Olympiades'},
  ];

  self.cards = buildCards(STATIONS, self.velibCardWindow);


  self.velibCardWindow.window.on('click', 'up', function (e) {
    console.log('up');
    self.rotate(-1);
  });

  self.velibCardWindow.window.on('click', 'down', function (e) {
    console.log('down');
    self.rotate(1);
  });

  self.velibCardWindow.window.on('click', 'select', function (e) {
    console.log('select');
    self.show();
  });
  self.velibCardWindow.window.on('longClick', 'select', function (e) {
    console.log('select');
    new VelibStations().refresh(function(data){
      self.show();
    });

  });

  self.velibCardWindow.window.on('longClick', 'up', function (e) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      new VelibStations().getClosestStations(pos, function (data) {
        if (!data || data.length == 0) {
          console.error('no station close to te current location');
          self.velibCardWindow.error('pas de station proche');
          return;
        }
        var stations = data.map(function (stationState) {
          return stationState.station;
        });
        console.log("stations:" + JSON.stringify(stations));
        self.cards = buildCards(stations, self.velibCardWindow);
        self.index = 0;
        self.show();
      });
    });
  });


  self.velibCardWindow.window.on('longClick', 'down', function (e) {
    self.cards = buildCards(STATIONS, self.velibCardWindow);
    self.index = 0;
    self.show();
  });

  self.index = 0;

  self.rotate = function (direction) {
    self.index = (self.cards.length + self.index + direction) % self.cards.length;
    self.show();
  }

  self.show = function (idx) {
    if (idx) {
      self.index = idx;
    }
    self.cards[self.index].show();
  }

}

module.exports = VelibApp;


