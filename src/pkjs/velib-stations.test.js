const expect = require('chai').expect;

require('./test-mock.js').setup();

const VelibStations = require('./velib-stations.js');


describe('the card stations state getter', function () {
  this.timeout(10000);

   it('should build the list of stations on init', function (done) {

    var velibStations = new VelibStations();
    var state = velibStations.getState('16107');

    expect(state).not.to.be.empty;
    expect(state.station.code).to.equal('16107');
    expect(state.station.name).to.equal('Benjamin Godard - Victor Hugo');
    expect(state.nbBike).to.equal(99);
    expect(state.nbEbike).to.equal(98);
    expect(state.nbFreeDock).to.equal(97);
    expect(state.nbFreeEDock).to.equal(96);

    done();
  });

  it('should be able to refresh a station state', function (done) {

    var velibStations = new VelibStations();
    velibStations.refreshState('16107', function (data) {

        expect(data).not.to.be.empty;
        expect(data.station.code).to.equal('16107');
        expect(data.station.name).to.equal('Benjamin Godard - Victor Hugo');
        expect(data.nbBike).not.to.equal(99);
        expect(data.nbEbike).not.to.equal(98);
        expect(data.nbFreeDock).not.to.equal(97);
        expect(data.nbFreeEDock).not.to.equal(96);


        var state = velibStations.getState('16107');

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

  it('should be able to refresh a station state', function (done) {

    var velibStations = new VelibStations();
    velibStations.refresh(function (stations) {

        const data = stations['16107'];
        expect(data).not.to.be.empty;
        expect(data.station.code).to.equal('16107');
        expect(data.station.name).to.equal('Benjamin Godard - Victor Hugo');
        expect(data.nbBike).not.to.equal(99);
        expect(data.nbEbike).not.to.equal(98);
        expect(data.nbFreeDock).not.to.equal(97);
        expect(data.nbFreeEDock).not.to.equal(96);


        var state = velibStations.getState('16107');

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

