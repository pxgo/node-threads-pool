# node-threads-pool
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[david-image]: https://img.shields.io/david/pengxigua/node-threads-pool.svg?style=flat-square
[david-url]: https://david-dm.org/pengxigua/node-threads-pool
[node-image]: https://img.shields.io/badge/node.js-%3E=_12-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/node-threads-pool.svg?style=flat-square
[download-url]: https://npmjs.org/package/node-threads-pool
[license-image]: https://img.shields.io/npm/l/node-threads-pool.svg

# Installation 
```
npm install node-threads-pool
```

# Usage

```
const tp = new Eve(filename, threadCount);
```
+ @param {String} filename: The path to the Worker’s main script or module. [Detail description](https://nodejs.org/docs/latest-v12.x/api/worker_threads.html#worker_threads_new_worker_filename_options)
+ @param {Number} threadCount:  The number of threads in the thread pool
```
tp.run(workerData);
```
+ @param {Object} workerData: Any JavaScript value that will be cloned and made available as require('worker_threads').workerData. [Detail description](https://nodejs.org/docs/latest-v12.x/api/worker_threads.html#worker_threads_new_worker_filename_options)
+ @return {Promise} The result

```
const thread = new Thread(func);
```
+ @param {Function} func: some code

# Example

## 1. Open 20 threads to perform some calculations

// main.js
```
const {Eve} = require('node-threads-pool');

const tp = new Eve('thread.js', 20);
module.exports = async (data) => {
  return await tp.run(data);
};
```

// thread.js
```
const {Thread} = require('node-threads-pool');

const thread = new Thread(async (data) => {
  return await doSomething(data);
});

```
Or write to the same JS file

// main.js
```
const {Eve, Thread, isMainThread} = require('node-threads-pool');


if(isMainThread) {
  const tp = new Eve(__filename, 20);
  module.exports = async function(data) {
    return await tp.run(data);
  };
} else {
  new Thread(async (data) => {
    return await doSomething(data);
  });
}
```

## 2. Render PUG to HTML
```
const pug = require('pug');
const os = require('os');
const {Eve, Thread, isMainThread} = require('node-threads-pool');

if(!isMainThread) {
  const options = {};
  new Thread(_data => {
    const {template, data} = _data;
    options.data = data;
    return pug.renderFile(template, options);
  });
} else {
  const tp = new Eve(__filename, os.cpus().length);
  module.exports = async (template, data) => {
    return await tp.run({
      template, data
    });
  };
}

```
## Test
```
npm run eve
```