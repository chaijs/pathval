var expect = require('chai').expect;
var gpv = require('..');

describe('pathval', function() {
  it('returns the correct value', function() {
    var object = {
        hello: 'universe'
      , universe: {
          hello: 'world'
        }
      , world: [ 'hello', 'universe' ]
      , complex: [
            { hello: 'universe' }
          , { universe: 'world' }
          , [ { hello: 'world' } ]
        ]
    };

    var arr = [ [ true ] ];

    expect(gpv('hello', object)).to.equal('universe');
    expect(gpv('universe.hello', object)).to.equal('world');
    expect(gpv('world[1]', object)).to.equal('universe');
    expect(gpv('complex[1].universe', object)).to.equal('world');
    expect(gpv('complex[2][0].hello', object)).to.equal('world');
    expect(gpv('[0][0]', arr)).to.be.true;
  });

  it('handles undefined objects and properties', function() {
    var object = {};

    expect(gpv('this.should.work', undefined)).to.be.undefined;
    expect(gpv('this.should.work', object)).to.be.undefined;
  });
});
