var UI;
var Vector2;
var Feature;

if (Pebble === {}) {
  UI = require('pebblejs/ui');
  Vector2 = require('pebblejs/lib/vector2');
  Feature = require('pebblejs/platform/feature');
} else {
  UI = require('../../node_modules/pebblejs/dist/js/ui');
  Vector2 = require('../../node_modules/pebblejs/dist/js/lib/vector2');
  Feature = require('../../node_modules/pebblejs/dist/js/platform/feature');
}
// const moment = require('pebblejs/vendor/moment');


// UI.Window.prototype.center = function (element, moveVector) {
//   var wind = this;
//   var windSize = wind.size();
// // Center the radial in the window
//   var elementPos = element.position()
//     .addSelf(windSize)
//     .subSelf(element.size())
//     .multiplyScalar(0.5);
//   if (moveVector) {
//     elementPos = elementPos.subSelf(moveVector);
//   }
//   element.position(elementPos);
//   wind.add(element);
//   return element;
// };


function VelibCardWindow() {
  const self = this;

  const backgroundColor = 'black';
  const foregroundColor = 'white';
  const bikeColor = 'mint green';
  const ebikeColor = 'celeste';
  const parkingColor = 'pastel yellow';
  const stationColor = Feature.color('rajah', 'white');

  this.window = new UI.Window({
    backgroundColor: backgroundColor,
    status: {
      color: foregroundColor,
      backgroundColor: backgroundColor,
      separator: 'none',
    },
  });

  const size = this.window.size();

  this.stationName = new UI.Text({
    size: new Vector2(size.x, 28),
    position: new Vector2(0, -4),
    font: 'gothic-28-bold',
    text: 'stationName',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    // backgroundColor: 'black',
    //color: 'windsorTan'
    color: stationColor,
  });

  this.errorMessageBox = new UI.Rect({
    size: new Vector2(size.x, 28),
    position: new Vector2(0, 0),
    backgroundColor: 'pastelYellow'
  });


  this.errorMessage = new UI.Text({
    size: new Vector2(size.x, 28),
    position: new Vector2(0, 0),
    font: 'gothic-14-bold',
    text: '',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'red',
  });

  this.bikeRemaining = new UI.Text({
    size: new Vector2(size.x, 40),
    position: new Vector2(-40, 30),
    font: 'leco-36-bold-numbers',
    text: '-',
    color: bikeColor,
    textAlign: 'center',
  });

  this.bikeRemainingLabel = new UI.Text({
    size: new Vector2(size.x, 40),
    position: new Vector2(-40, 65),
    font: 'gothic-14',
    text: 'velib',
    color: bikeColor,
    textAlign: 'center',
  });

  this.eBikeRemaining = new UI.Text({
    size: new Vector2(size.x, 40),
    position: new Vector2(+40, 30),
    text: '-',
    font: 'leco-36-bold-numbers',
    color: ebikeColor,
    textAlign: 'center',
  });

  this.eBikeRemainingLabel = new UI.Text({
    size: new Vector2(size.x, 40),
    position: new Vector2(+40, 65),
    font: 'gothic-14',
    text: 'e-velib',
    color: ebikeColor,
    textAlign: 'center',
  });


  this.parkingRemaining = new UI.Text({
    size: new Vector2(size.x, 40),
    position: new Vector2(+0, 95),
    text: '-',
    font: 'leco-36-bold-numbers',
    color: parkingColor,
    textAlign: 'center',
  });

  this.parkingRemainingLabel = new UI.Text({
    size: new Vector2(size.x, 40),
    position: new Vector2(0, 85),
    font: 'gothic-14',
    text: 'places',
    color: parkingColor,
    textAlign: 'center',
  });

  // var refreshIcon = new UI.Image({
  //   position: new Vector2(0, 0),
  //   size: new Vector2(24, 24),
  //   image: 'images/refresh-page-option.png'
  // });
  //
  // this.window.add(this.refreshIcon);

  this.window.add(this.stationName);
  this.window.add(this.bikeRemaining);
  this.window.add(this.bikeRemainingLabel);
  this.window.add(this.eBikeRemaining);
  this.window.add(this.eBikeRemainingLabel);
  this.window.add(this.parkingRemaining);
  this.window.add(this.parkingRemainingLabel);
  this.window.add(this.errorMessageBox);
  this.window.add(this.errorMessage);

  // this.preRefreshContents();
  //
  // this.window.on('click', 'select', function (e) {
  //   self.displayDetails();
  // });

}

// VelibCard.prototype.preRefreshContents = function preRefreshContents() {
//   const self = this;
//   self.nextStopField.text('-');
//   this.nextStopUnit.text('')
//   self.nextStopDetailsField.text('chargement...');
// };


VelibCardWindow.prototype.refresh = function (velibStationInfo) {
  const self = this;

  const state = velibStationInfo.getState();

  if (state) {
    self.stationName.text(velibStationInfo.getStation().label || state.station.name);
    self.bikeRemaining.text(state.nbBike);
    self.eBikeRemaining.text(state.nbEbike);
    self.parkingRemaining.text(state.nbFreeDock + state.nbFreeEDock);
    self.errorMessage.text('');
    self.errorMessageBox.backgroundColor('clear');
  } else {
    self.stationName.text(velibStationInfo.getStation().label);
    self.bikeRemaining.text('-');
    self.eBikeRemaining.text('-');
    self.parkingRemaining.text('-');
    self.errorMessage.text('');
    self.errorMessageBox.backgroundColor('clear');
  }
};

VelibCardWindow.prototype.error = function (err) {
  const self = this;
  self.errorMessage.text(JSON.stringify(err));
  self.errorMessageBox.backgroundColor('pastelYellow');

};


VelibCardWindow.prototype.show = function () {
  this.window.show();
};

VelibCardWindow.prototype.hide = function () {
  this.window.hide();
};

module.exports = VelibCardWindow;
