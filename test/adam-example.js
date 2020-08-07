const {Adam} = require('../index');
const {isMainThread, workerData, parentPort} = require('worker_threads');

if(isMainThread) {
  main();
} else {
  thread();
}

function main() {
  const tp = new Adam(10);
  for(let i = 0; i < 1000; i++) {
    tp.run(__filename, {
      workerData: {
        index: i
      }
    })
    .then(r => {
      console.log(`index: ${r.index}, result: ${r.result}`);
    })
    .catch(console.error);
  }
}

function thread() {
  const {index} = workerData;
  const result = fn(42);
  parentPort.postMessage({index, result});
}


function fn(n) {
  if(n < 3) return 1;
  return fn(n-2) + fn(n-1);
}