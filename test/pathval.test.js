var assert = require('simple-assert');
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

    assert(gpv('hello', object) === 'universe');
    assert(gpv('universe.hello', object) === 'world');
    assert(gpv('world[1]', object) === 'universe');
    assert(gpv('complex[1].universe', object) === 'world');
    assert(gpv('complex[2][0].hello', object) === 'world');
    assert(gpv('[0][0]', arr) === true);
  });

  it('handles undefined objects and properties', function() {
    var object = {};

    assert(gpv('this.should.work', undefined) === undefined);
    assert(gpv('this.should.work', object) === undefined);
  });
});
