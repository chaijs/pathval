'use strict';

var assert = require('simple-assert');
var pathval = require('..');
describe('hasProperty', function () {
  it('should handle array index', function () {
    var arr = [ 1, 2, 'cheeseburger' ];
    assert(pathval.hasProperty(arr, 1) === true);
    assert(pathval.hasProperty(arr, 3) === false);
  });

  it('should handle primitives', function () {
    var exampleString = 'string literal';
    assert(pathval.hasProperty(exampleString, 'length') === true);
    assert(pathval.hasProperty(exampleString, 3) === true);
    assert(pathval.hasProperty(exampleString, 14) === false);

    assert(pathval.hasProperty(1, 'foo') === false);
    assert(pathval.hasProperty(false, 'bar') === false);
    assert(pathval.hasProperty(true, 'toString') === true);

    if (typeof Symbol === 'function') {
      assert(pathval.hasProperty(Symbol(), 1) === false);
      assert(pathval.hasProperty(Symbol.iterator, 'valueOf') === true);
    }
  });

  it('should handle objects', function () {
    var exampleObj = {
      foo: 'bar',
    };
    assert(pathval.hasProperty(exampleObj, 'foo') === true);
    assert(pathval.hasProperty(exampleObj, 'baz') === false);
    assert(pathval.hasProperty(exampleObj, 0) === false);
  });

  it('should handle undefined', function () {
    assert(pathval.hasProperty(undefined, 'foo') === false);
  });

  it('should handle null', function () {
    assert(pathval.hasProperty(null, 'foo') === false);
  });
});

describe('getPathInfo', function () {
  var obj = {
    id: '10702S300W',
    primes: [ 2, 3, 5, 7, 11 ],
    dimensions: {
      units: 'mm',
      lengths: [ [ 1.2, 3.5 ], [ 2.2, 1.5 ], [ 5, 7 ] ],
    },
    'dimensions.lengths': {
      '[2]': [ 1.2, 3.5 ],
    },
  };
  var gpi = pathval.getPathInfo;
  it('should handle simple property', function () {
    var info = gpi(obj, 'dimensions.units');
    assert(info.parent === obj.dimensions);
    assert(info.value === obj.dimensions.units);
    assert(info.name === 'units');
    assert(info.exists === true);
  });

  it('should handle non-existent property', function () {
    var info = gpi(obj, 'dimensions.size');
    assert(info.parent === obj.dimensions);
    assert(info.value === undefined);
    assert(info.name === 'size');
    assert(info.exists === false);
  });

  it('should handle array index', function () {
    var info = gpi(obj, 'primes[2]');
    assert(info.parent === obj.primes);
    assert(info.value === obj.primes[2]);
    assert(info.name === 2);
    assert(info.exists === true);
  });

  it('should handle dimensional array', function () {
    var info = gpi(obj, 'dimensions.lengths[2][1]');
    assert(info.parent === obj.dimensions.lengths[2]);
    assert(info.value === obj.dimensions.lengths[2][1]);
    assert(info.name === 1);
    assert(info.exists === true);
  });

  it('should handle out of bounds array index', function () {
    var info = gpi(obj, 'dimensions.lengths[3]');
    assert(info.parent === obj.dimensions.lengths);
    assert(info.value === undefined);
    assert(info.name === 3);
    assert(info.exists === false);
  });

  it('should handle out of bounds dimensional array index', function () {
    var info = gpi(obj, 'dimensions.lengths[2][5]');
    assert(info.parent === obj.dimensions.lengths[2]);
    assert(info.value === undefined);
    assert(info.name === 5);
    assert(info.exists === false);
  });

  it('should handle backslash-escaping for .[]', function () {
    var info = gpi(obj, 'dimensions\\.lengths.\\[2\\][1]');
    assert(info.parent === obj['dimensions.lengths']['[2]']);
    assert(info.value === obj['dimensions.lengths']['[2]'][1]);
    assert(info.name === 1);
    assert(info.exists === true);
  });
});

describe('getPathValue', function () {
  it('returns the correct value', function () {
    var object = {
      hello: 'universe',
      universe: {
        hello: 'world',
      },
      world: [ 'hello', 'universe' ],
      complex: [ { hello: 'universe' }, { universe: 'world' }, [ { hello: 'world' } ] ],
    };

    var arr = [ [ true ] ];
    assert(pathval.getPathValue(object, 'hello') === 'universe');
    assert(pathval.getPathValue(object, 'universe.hello') === 'world');
    assert(pathval.getPathValue(object, 'world[1]') === 'universe');
    assert(pathval.getPathValue(object, 'complex[1].universe') === 'world');
    assert(pathval.getPathValue(object, 'complex[2][0].hello') === 'world');
    assert(pathval.getPathValue(arr, '[0][0]') === true);
  });

  it('handles undefined objects and properties', function () {
    var object = {};
    assert(pathval.getPathValue(undefined, 'this.should.work') === null);
    assert(pathval.getPathValue(object, 'this.should.work') === null);
    assert(pathval.getPathValue('word', 'length') === 4);
  });
});

describe('setPathValue', function () {
  it('allows value to be set in simple object', function () {
    var obj = {};
    pathval.setPathValue(obj, 'hello', 'universe');
    assert(obj.hello === 'universe');
  });

  it('allows nested object value to be set', function () {
    var obj = {};
    pathval.setPathValue(obj, 'hello.universe', 'properties');
    assert(obj.hello.universe === 'properties');
  });

  it('allows nested array value to be set', function () {
    var obj = {};
    pathval.setPathValue(obj, 'hello.universe[1].properties', 'galaxy');
    assert(obj.hello.universe[1].properties === 'galaxy');
  });

  it('allows value to be REset in simple object', function () {
    var obj = { hello: 'world' };
    pathval.setPathValue(obj, 'hello', 'universe');
    assert(obj.hello === 'universe');
  });

  it('allows value to be set in complex object', function () {
    var obj = { hello: {} };
    pathval.setPathValue(obj, 'hello.universe', 42);
    assert(obj.hello.universe === 42);
  });

  it('allows value to be REset in complex object', function () {
    var obj = { hello: { universe: 100 } };
    pathval.setPathValue(obj, 'hello.universe', 42);
    assert(obj.hello.universe === 42);
  });

  it('allows for value to be set in array', function () {
    var obj = { hello: [] };
    pathval.setPathValue(obj, 'hello[0]', 1);
    pathval.setPathValue(obj, 'hello[2]', 3);

    assert(obj.hello[0] === 1);
    assert(obj.hello[1] === undefined);
    assert(obj.hello[2] === 3);
  });

  it('allows setting a value into an object inside an array', function () {
    var obj = { hello: [ { anObject: 'obj' } ] };
    pathval.setPathValue(obj, 'hello[0].anotherKey', 'anotherValue');

    assert(obj.hello[0].anotherKey === 'anotherValue');
  });

  it('allows for value to be REset in array', function () {
    var obj = { hello: [ 1, 2, 4 ] };
    pathval.setPathValue(obj, 'hello[2]', 3);

    assert(obj.hello[0] === 1);
    assert(obj.hello[1] === 2);
    assert(obj.hello[2] === 3);
  });

  it('allows for value to be REset in array', function () {
    var obj = { hello: [ 1, 2, 4 ] };
    pathval.setPathValue(obj, 'hello[2]', 3);

    assert(obj.hello[0] === 1);
    assert(obj.hello[1] === 2);
    assert(obj.hello[2] === 3);
  });

  it('returns the object in which the value was set', function () {
    var obj = { hello: [ 1, 2, 4 ] };
    var valueReturned = pathval.setPathValue(obj, 'hello[2]', 3);
    assert(obj === valueReturned);
  });
});
