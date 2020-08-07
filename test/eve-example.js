const {Eve, Thread, isMainThread} = require('../index');

if(isMainThread) {
  main();
} else {
  thread();
}

async function main() {
  const tp = new Eve(__filename, 20);  
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
    if(index < 100) return process.exit(1);
    const d = fn(42);
    await sleep(1000);
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