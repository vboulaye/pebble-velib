const VelibStationInfo = require('./velib-station-info.js');
const VelibCardWindow = require('./velib-card-window.js');


function VelibApp() {
  const self = this;
  self.velibCardWindow = new VelibCardWindow();

  var STATIONS = [
    {code: '13055', label: 'BFM-Frigo'},
    {code: '13053', label: 'BFM-Bas'},
    {code: '13052', label: 'BFM-Leredde'},
    {code: '13036', label: 'Olympiades'},
  ];

  self.cards = STATIONS.map(function (station) {
    const info = new VelibStationInfo(station);
    info.show = function () {
      self.velibCardWindow.show();
      self.velibCardWindow.refresh(info);
      info.refresh(function (data) {
          self.velibCardWindow.refresh(info);
        }, function (err) {
          self.velibCardWindow.error(err);
        }
      );
    };
    return info;
  });


  self.velibCardWindow.window.on('click', 'up', function (e) {
    self.rotate(-1);
  });

  self.velibCardWindow.window.on('click', 'down', function (e) {
    self.rotate(1);
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


