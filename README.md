## node-threads-pool
nodejs threads pool

### Install
```
npm install node-threads-pool
```

### Example
```

//app.js

const TP = require("node-threads-pool");
const tp = new TP(5);

tp.run("./thread.js")
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
  if(n < 3) return n - 1;
  return fn(n-2) + fn(n-1);
}
parentPort.postMessage(fn(n));

```