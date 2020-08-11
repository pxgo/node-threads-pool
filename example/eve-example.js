const {Eve, Thread, isMainThread} = require('../index');
const os = require('os');

if(isMainThread) {
  main();
} else {
  thread();
}

async function main() {
  const tp = new Eve(__filename, os.cpus().length);  
  for(let i = 0; i < 1000; i++) {
    tp.run({index: i})
      .then(r => {
        console.log(`index: ${r.index}, result: ${r.result}`);
      })
      .catch(console.error);
  }
}
async function thread() {
  new Thread(async (data) => {
    const {index} = data;
    const d = fn(42);
    await sleep(500);
    return {
      index,
      result: d
    };
  });
}


function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t)
  })
}

function fn(n) {
  if(n < 3) return 1;
  return fn(n-2) + fn(n-1);
}