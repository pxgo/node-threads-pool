# Node-Threads-Pool

Node-Threads-Pool is a Node.js library that provides a simple and efficient way to execute tasks in child threads. It creates a pool of threads that can be used to parallelize the execution of CPU-intensive tasks, making it possible to take advantage of multi-core processors.

The library is designed to be easy to use and to integrate with existing projects. It provides a simple API that allows you to create a thread pool and run tasks in child threads, and it also supports passing data between threads.

[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[david-url]: https://david-dm.org/pengxigua/node-threads-pool
[node-image]: https://img.shields.io/badge/node.js-%3E=_12-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/node-threads-pool.svg?style=flat-square
[download-url]: https://npmjs.org/package/node-threads-pool
[license-image]: https://img.shields.io/npm/l/node-threads-pool.svg


Installation
------------

You can install Node-Threads-Pool using NPM:

```
npm install node-threads-pool
```

Usage
-----

To use Node-Threads-Pool, you need to create an instance of the `Eve` class, which represents the thread pool. 

```javascript
// main.js

const { Eve } = require('node-threads-pool');

const tp = new Eve(filename, threadCount);

```

The `Eve` constructor takes two arguments: the path to the worker script and the number of threads to create. The `run` method takes one argument, which is the data to be passed to the worker script.


*   `filename`: The path to the worker's main script or module. See [the Node.js documentation](https://nodejs.org/docs/latest-v12.x/api/worker_threads.html#worker_threads_new_worker_filename_options) for more details.
*   `threadCount`: The number of threads in the thread pool.

To run a task in a worker thread, use the `run` method:

```javascript
// main.js

tp.run(workerData)
  .then(result => {
    // handle the result
  })
  .catch(err => {
    // handle the error
  })
``` 

You can create a new thread directly using the `Thread` class:

```javascript
// thread.js

const {Thread} = require('node-threads-pool');

new Thread(async (data) => {
  // Do some work with data
  const result = await doSomething(data);
  return result;
});
```

The `Thread` constructor takes a single argument, which is the function to be executed in the child thread. The function should return a Promise that resolves with the result of the computation.

Example
-------

Here are some examples of how to use Node Threads Pool.

### Example 1: Running calculations in 20 threads

This example shows how to create a pool of 20 worker threads to perform some calculations:

```javascript
// main.js
const os = require('os');
const { Eve } = require('node-threads-pool');

const tp = new Eve('thread.js', os.cpus().length);

module.exports = async (data) => {
  return await tp.run(data);
};


// thread.js
const { Thread } = require('node-threads-pool');

const thread = new Thread(async (data) => {
  return await doSomething(data);
});

```

Alternatively, you can write to the same JS file:


```javascript
// main.js
const { Eve, Thread, isMainThread } = require('node-threads-pool');
const os = require('os');

if(isMainThread) {

  const tp = new Eve('thread.js', os.cpus().length);

  module.exports = async (data) => {
    return await tp.run(data);
  };

} else {

  new Thread(async (data) => {
    return await doSomething(data);
  });

}
```

### Example 2: Rendering Pug to HTML

This example shows how to use Node Threads Pool to render Pug templates to HTML:
```javascript
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

Test
-----
```
npm run eve
```

License
-------

Node-Threads-Pool is licensed under the MIT License. (see [LICENSE](https://github.com/PxGo/node-threads-pool/blob/main/LICENSE))
