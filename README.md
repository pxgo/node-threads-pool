## node-threads-pool
[david-image]: https://img.shields.io/david/pengxigua/node-threads-pool.svg?style=flat-square
[david-url]: https://david-dm.org/pengxigua/node-threads-pool
[node-image]: https://img.shields.io/badge/node.js-%3E=_12-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/node-threads-pool.svg?style=flat-square
[download-url]: https://npmjs.org/package/node-threads-pool
[license-image]: https://img.shields.io/npm/l/node-threads-pool.svg

### Install
```
npm install node-threads-pool
```

### Usage
```

//app.js

const TP = require("node-threads-pool");
const tp = new TP(5);

tp.run("./thread.js", {
  workerData: {
    n: 40
  }
})
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  })
```

```
// thread.js

const {workerData, parentPort} = require("worker_threads");
const {n} = workerData;
const fn = (n) => {
  if(n < 3) return 1;
  return fn(n-2) + fn(n-1);
}
parentPort.postMessage(fn(n));

```

### Methods

#### new TP([number]); // number: the maximum number of threads. The default value is 1.
Create a thread pool instance.


#### TP.run(filename[, options]); // options: [View here](https://nodejs.org/dist/latest-v12.x/docs/api/worker_threads.html#worker_threads_new_worker_filename_options)

Run a file in a child thread.