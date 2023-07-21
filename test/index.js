import assert from 'simple-assert';

import * as pathval from '../index.js';

describe('hasProperty', () => {
  it('should handle array index', () => {
    const arr = [ 1, 2, 'cheeseburger' ];
    assert(pathval.hasProperty(arr, 1) === true);
    assert(pathval.hasProperty(arr, 3) === false);
  });

  it('should handle primitives', () => {
    const exampleString = 'string literal';
    assert(pathval.hasProperty(exampleString, 'length') === true);
    assert(pathval.hasProperty(exampleString, 3) === true);
    assert(pathval.hasProperty(exampleString, 14) === false);

    assert(pathval.hasProperty(1, 'foo') === false);
    assert(pathval.hasProperty(false, 'bar') === false);
    assert(pathval.hasProperty(true, 'toString') === true);

    if (typeof Symbol === 'function') {
      assert(pathval.hasProperty(Symbol('foobar'), 1) === false);
      assert(pathval.hasProperty(Symbol.iterator, 'valueOf') === true);
    }
  });

  it('should handle objects', () => {
    const exampleObj = {
      foo: 'bar',
    };
    assert(pathval.hasProperty(exampleObj, 'foo') === true);
    assert(pathval.hasProperty(exampleObj, 'baz') === false);
    assert(pathval.hasProperty(exampleObj, 0) === false);
  });

  it('should handle undefined', () => {
    assert(pathval.hasProperty(undefined, 'foo') === false);
  });

  it('should handle null', () => {
    assert(pathval.hasProperty(null, 'foo') === false);
  });
});

describe('getPathInfo', () => {
  const obj = {
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
  const gpi = pathval.getPathInfo;
  it('should handle simple property', () => {
    const info = gpi(obj, 'dimensions.units');
    assert(info.parent === obj.dimensions);
    assert(info.value === obj.dimensions.units);
    assert(info.name === 'units');
    assert(info.exists === true);
  });

  it('should handle non-existent property', () => {
    const info = gpi(obj, 'dimensions.size');
    assert(info.parent === obj.dimensions);
    assert(info.value === undefined);
    assert(info.name === 'size');
    assert(info.exists === false);
  });

  it('should handle array index', () => {
    const info = gpi(obj, 'primes[2]');
    assert(info.parent === obj.primes);
    assert(info.value === obj.primes[2]);
    assert(info.name === 2);
    assert(info.exists === true);
  });

  it('should handle dimensional array', () => {
    const info = gpi(obj, 'dimensions.lengths[2][1]');
    assert(info.parent === obj.dimensions.lengths[2]);
    assert(info.value === obj.dimensions.lengths[2][1]);
    assert(info.name === 1);
    assert(info.exists === true);
  });

  it('should handle out of bounds array index', () => {
    const info = gpi(obj, 'dimensions.lengths[3]');
    assert(info.parent === obj.dimensions.lengths);
    assert(info.value === undefined);
    assert(info.name === 3);
    assert(info.exists === false);
  });

  it('should handle out of bounds dimensional array index', () => {
    const info = gpi(obj, 'dimensions.lengths[2][5]');
    assert(info.parent === obj.dimensions.lengths[2]);
    assert(info.value === undefined);
    assert(info.name === 5);
    assert(info.exists === false);
  });

  it('should handle backslash-escaping for .[]', () => {
    const info = gpi(obj, 'dimensions\\.lengths.\\[2\\][1]');
    assert(info.parent === obj['dimensions.lengths']['[2]']);
    assert(info.value === obj['dimensions.lengths']['[2]'][1]);
    assert(info.name === 1);
    assert(info.exists === true);
  });
});

describe('getPathValue', () => {
  it('returns the correct value', () => {
    const object = {
      hello: 'universe',
      universe: {
        hello: 'world',
      },
      world: [ 'hello', 'universe' ],
      complex: [ { hello: 'universe' }, { universe: 'world' }, [ { hello: 'world' } ] ],
    };

    const arr = [ [ true ] ];
    assert(pathval.getPathValue(object, 'hello') === 'universe');
    assert(pathval.getPathValue(object, 'universe.hello') === 'world');
    assert(pathval.getPathValue(object, 'world[1]') === 'universe');
    assert(pathval.getPathValue(object, 'complex[1].universe') === 'world');
    assert(pathval.getPathValue(object, 'complex[2][0].hello') === 'world');
    assert(pathval.getPathValue(arr, '[0][0]') === true);
  });

  it('handles undefined objects and properties', () => {
    const object = {};
    assert(pathval.getPathValue(undefined, 'this.should.work') === null);
    assert(pathval.getPathValue(object, 'this.should.work') === null);
    assert(pathval.getPathValue('word', 'length') === 4);
  });
});

describe('setPathValue', () => {
  it('allows value to be set in simple object', () => {
    const obj = {};
    pathval.setPathValue(obj, 'hello', 'universe');
    assert(obj.hello === 'universe');
  });

  it('allows nested object value to be set', () => {
    const obj = {};
    pathval.setPathValue(obj, 'hello.universe', 'properties');
    assert(obj.hello.universe === 'properties');
  });

  it('allows nested array value to be set', () => {
    const obj = {};
    pathval.setPathValue(obj, 'hello.universe[1].properties', 'galaxy');
    assert(obj.hello.universe[1].properties === 'galaxy');
  });

  it('allows value to be REset in simple object', () => {
    const obj = { hello: 'world' };
    pathval.setPathValue(obj, 'hello', 'universe');
    assert(obj.hello === 'universe');
  });

  it('allows value to be set in complex object', () => {
    const obj = { hello: {} };
    pathval.setPathValue(obj, 'hello.universe', 42);
    assert(obj.hello.universe === 42);
  });

  it('allows value to be REset in complex object', () => {
    const obj = { hello: { universe: 100 } };
    pathval.setPathValue(obj, 'hello.universe', 42);
    assert(obj.hello.universe === 42);
  });

  it('allows for value to be set in array', () => {
    const obj = { hello: [] };
    pathval.setPathValue(obj, 'hello[0]', 1);
    pathval.setPathValue(obj, 'hello[2]', 3);

    assert(obj.hello[0] === 1);
    assert(obj.hello[1] === undefined);
    assert(obj.hello[2] === 3);
  });

  it('allows setting a value into an object inside an array', () => {
    const obj = { hello: [ { anObject: 'obj' } ] };
    pathval.setPathValue(obj, 'hello[0].anotherKey', 'anotherValue');

    assert(obj.hello[0].anotherKey === 'anotherValue');
  });

  it('allows for value to be REset in array', () => {
    const obj = { hello: [ 1, 2, 4 ] };
    pathval.setPathValue(obj, 'hello[2]', 3);

    assert(obj.hello[0] === 1);
    assert(obj.hello[1] === 2);
    assert(obj.hello[2] === 3);
  });

  it('allows for value to be REset in array', () => {
    const obj = { hello: [ 1, 2, 4 ] };
    pathval.setPathValue(obj, 'hello[2]', 3);

    assert(obj.hello[0] === 1);
    assert(obj.hello[1] === 2);
    assert(obj.hello[2] === 3);
  });

  it('returns the object in which the value was set', () => {
    const obj = { hello: [ 1, 2, 4 ] };
    const valueReturned = pathval.setPathValue(obj, 'hello[2]', 3);
    assert(obj === valueReturned);
  });

  describe('fix prototype pollution vulnerability', () => {

    it('exclude constructor', () => {
      const obj = {};
      assert(typeof obj.constructor === 'function'); // eslint-disable-line
      pathval.setPathValue(obj, 'constructor', null);
      assert(typeof obj.constructor === 'function'); // eslint-disable-line
    });

    it('exclude __proto__', () => {
      const obj = {};
      assert(typeof polluted === 'undefined'); // eslint-disable-line
      pathval.setPathValue(obj, '__proto__.polluted', true);
      assert(typeof polluted === 'undefined'); // eslint-disable-line
    });

    it('exclude prototype', () => {
      const obj = {};
      assert(typeof obj.prototype === 'undefined'); // eslint-disable-line
      pathval.setPathValue(obj, 'prototype', true);
      assert(typeof obj.prototype === 'undefined'); // eslint-disable-line
    });

  });

});
