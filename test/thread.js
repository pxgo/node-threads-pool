const {workerData, parentPort} = require("worker_threads");
const {n, index} = workerData;
const fn = (n) => {
  if(n < 3) return 1;
  return fn(n-2) + fn(n-1);
}
parentPort.postMessage({
  index,
  number: fn(n)
});