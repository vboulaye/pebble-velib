const expect = require('chai').expect;

require('./test-mock.js').setup();

var VelibStationInfo = require('./velib-station-info.js');

describe('the velib station info', function () {
  this.timeout(10000);

  it('contains basic station info', function (done) {

    var velibStationInfo = new VelibStationInfo({code:'16107', label:'Victor Hugo'});
    expect(velibStationInfo).not.to.be.empty;
    expect(velibStationInfo.station).not.to.be.empty;
    expect(velibStationInfo.station.code).to.equal('16107');
    expect(velibStationInfo.station.label).to.equal('Victor Hugo');

    // get initial state (not refreshed)
    const data = velibStationInfo.getState();
    expect(data).not.to.be.empty;
    expect(data.station.code).to.equal('16107');
    expect(data.station.name).to.equal('Benjamin Godard - Victor Hugo');
    expect(data.nbBike).to.equal(99);
    expect(data.nbEbike).to.equal(98);
    expect(data.nbFreeDock).to.equal(97);
    expect(data.nbFreeEDock).to.equal(96);

    done();
  });

  it('can be refreshed with an up to date state', function (done) {


    const velibStationInfo = new VelibStationInfo({code:'16107', label:'Victor Hugo'});

    velibStationInfo.refresh(function(data) {

        expect(data).not.to.be.empty;
        expect(data.station.code).to.equal('16107');
        expect(data.station.name).to.equal('Benjamin Godard - Victor Hugo');
        expect(data.nbBike).not.to.equal(99);
        expect(data.nbEbike).not.to.equal(98);
        expect(data.nbFreeDock).not.to.equal(97);
        expect(data.nbFreeEDock).not.to.equal(96);


        var state = velibStationInfo.getState();

        expect(state).not.to.be.empty;
        expect(state.station.code).to.equal('16107');
        expect(state.station.name).to.equal('Benjamin Godard - Victor Hugo');
        expect(state.nbBike).to.equal(data.nbBike);
        expect(state.nbEbike).to.equal(data.nbEbike);
        expect(state.nbFreeDock).to.equal(data.nbFreeDock);
        expect(state.nbFreeEDock).to.equal(data.nbFreeEDock);

        done();
      },
      done // on error
    );

  });

});

