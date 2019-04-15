const expect = require('chai').expect;
require('./test-mock.js').setup();

var VelibCardWindow = require('./velib-card-window.js');

describe('the velib card window', function () {
  this.timeout(10000);

  it('can be constructed', function (done) {

    var card = new VelibCardWindow();
    expect(card).not.to.be.empty;

    expect(card.window).not.to.be.empty;
    expect(card.stationName).not.to.be.empty;
    expect(card.bikeRemaining).not.to.be.empty;
    expect(card.eBikeRemaining).not.to.be.empty;

    expect(card.stationName.text()).to.equal('stationName');
    expect(card.bikeRemaining.text()).to.equal('-');
    expect(card.eBikeRemaining.text()).to.equal('-');

    done();
  });

  it('can be refreshed with an up to date state', function (done) {

    var card = new VelibCardWindow();
    const velibStationInfo = {
      getStation: function () {
        return {code: '123', label: 'stationLabel'};
      },
      getState: function () {
        return {
          nbBike: 1,
          nbEbike: 2,
          nbFreeDock: 3,
          nbFreeEDock: 4,
        }
      }
    };
    card.refresh(velibStationInfo);

    expect(card.stationName.text()).to.equal('stationLabel');
    expect(card.bikeRemaining.text()).to.equal(1);
    expect(card.eBikeRemaining.text()).to.equal(2);
    expect(card.parkingRemaining.text()).to.equal(7);

    done();

  });

});

