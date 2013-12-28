var assert = require('simple-assert');
var gpv = require('..').get;

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

    assert(gpv(object, 'hello') === 'universe');
    assert(gpv(object, 'universe.hello') === 'world');
    assert(gpv(object, 'world[1]') === 'universe');
    assert(gpv(object, 'complex[1].universe') === 'world');
    assert(gpv(object, 'complex[2][0].hello') === 'world');
    assert(gpv(arr, '[0][0]') === true);
  });

  it('handles undefined objects and properties', function() {
    var object = {};

    assert(gpv(undefined, 'this.should.work') === undefined);
    assert(gpv(object, 'this.should.work') === undefined);
  });
});
