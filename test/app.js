const TP = require("../index");
const tp = new TP(10);

for(var i = 0; i < 1000; i++) {
  tp.run(__dirname + "/thread.js", {
    workerData: {
      n: 40,
      index: i
    }
  })
  .then(data=> {
    console.log(`${data.index}: ${data.number}`);
  })
  .catch(err => {
    console.error(err);
  })
}