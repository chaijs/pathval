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

  assert(get(object, 'hello') === 'universe');
  assert(get(object, 'universe.hello') === 'world');
  assert(get(object, 'world[1]') === 'universe');
  assert(get(object, 'complex[1].universe') === 'world');
  assert(get(object, 'complex[2][0].hello') === 'world');
  assert(get(arr, '[0][0]') === true);
});

it('handles undefined objects and properties', function() {
  var object = {};

  assert(get(undefined, 'this.should.work') === undefined);
  assert(get(object, 'this.should.work') === undefined);
});
