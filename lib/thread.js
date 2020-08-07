const {parentPort, workerData} = require("worker_threads");

module.exports = class {
  constructor(func) {
    this.id = workerData.index;
    const self = this;
    parentPort.on('message', async data => {
      try{
        const d = await func(data, self);
        parentPort.postMessage({
          status: 'success',
          data: d
        });
      } catch(err) {
        parentPort.postMessage({
          status: 'failed',
          data: err
        });
      }
    });
    this.timer();
  }
  timer() {
    setInterval(()=>{}, 24 * 60 * 60 * 1000);
  }
}