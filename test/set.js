it('allows value to be set in simple object', function () {
  var obj = {};
  set(obj, 'hello', 'universe');
  assert(obj.hello === 'universe');
});

it('allows nested object value to be set', function () {
  var obj = {};
  set(obj, 'hello.universe', 'properties');
  assert(obj.hello.universe === 'properties');
});

it('allows nested array value to be set', function () {
  var obj = {};
  set(obj, 'hello.universe[1].properties', 'galaxy');
  assert(obj.hello.universe[1].properties === 'galaxy');
});

it('allows value to be REset in simple object', function () {
  var obj = { hello: 'world' };
  set(obj, 'hello', 'universe');
  assert(obj.hello === 'universe');
});

it('allows value to be set in complex object', function () {
  var obj = { hello: { }};
  set(obj, 'hello.universe', 42);
  assert(obj.hello.universe === 42);
});

it('allows value to be REset in complex object', function () {
  var obj = { hello: { universe: 100 }};
  set(obj, 'hello.universe', 42);
  assert(obj.hello.universe === 42);
});

it('allows for value to be set in array', function () {
  var obj = { hello: [] };

  set(obj, 'hello[0]', 1);
  set(obj, 'hello[2]', 3);

  assert(obj.hello[0] === 1);
  assert(obj.hello[1] === undefined);
  assert(obj.hello[2] === 3);
});

it('allows for value to be REset in array', function () {
  var obj = { hello: [ 1, 2, 4 ] };

  set(obj, 'hello[2]', 3);

  assert(obj.hello[0] === 1);
  assert(obj.hello[1] === 2);
  assert(obj.hello[2] === 3);
});
