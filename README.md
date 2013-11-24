[![NPM version](https://badge.fury.io/js/pathval.png)](http://badge.fury.io/js/pathval)
[![Build Status](https://secure.travis-ci.org/chaijs/pathval.png)](http://travis-ci.org/chaijs/pathval)
[![Coverage Status](https://coveralls.io/repos/chaijs/pathval/badge.png?branch=master)](https://coveralls.io/r/chaijs/pathval?branch=master)
[![Code Climate](https://codeclimate.com/github/chaijs/pathval.png)](https://codeclimate.com/github/chaijs/pathval)

# pathval

## Usage

Given:

```js
var obj = {
    prop1: {
        arr: ['a', 'b', 'c']
      , str: 'Hello'
    }
  , prop2: {
        arr: [ { nested: 'Universe' } ]
      , str: 'Hello again!'
    }
}

var arr = [ { foo: 'bar' } ];
```

Expect:

<!-- js
  var getPathValue = require('./');
-->

```js
getPathValue('prop1.str', obj); // => "Hello"
getPathValue('prop1.arr[2]', obj); // => "c"
getPathValue('prop2.arr[0].nested', obj); // => "Universe"

getPathValue('[0].foo', arr); // => "bar"

getPathValue('doesnt.matter', undefined); // => undefined
getPathValue('doesnt.exist', {}); // => undefined
```

## Installation

```bash
npm install pathval
```

## Tests

### Running the tests

```bash
$ npm test
```

### Test coverage

```bash
$ npm run-script coverage
```

## License

MIT License

Copyright (c) 2011-2013 Jake Luer jake@alogicalparadox.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
