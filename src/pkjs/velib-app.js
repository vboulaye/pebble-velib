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

  const CARDS = STATIONS.map(function (station, index) {
    const info = new VelibStationInfo(station);
    info.index = index;
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

  function mod(a, n) {
    return (a + n) % n;
  }

  self.velibCardWindow.window.on('click', 'up', function (e) {
    var index = mod(cardHolder.index - 1, CARDS.length);
    CARDS[index].show();
  });

  self.velibCardWindow.window.on('click', 'down', function (e) {
    var index = mod(cardHolder.index + 1, CARDS.length);
    CARDS[index].show();
  });

  var firstCard = CARDS[0];
  firstCard.show();
  //self.velibCardWindow.window.show();
}

module.exports = VelibApp;


