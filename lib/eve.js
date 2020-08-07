const {Worker} = require("worker_threads");
module.exports = class {
  constructor(filename, count) {
    if(count < 1) throw 'count error';
    this._filename = filename;      
    this._workers = [];
    this._count = count;
    this._queue = [];
    this.initWorkers();
  }
  initWorkers() {
    const {_workers, _filename, _count} = this;
    const self = this;
    for(let i = 0; i < _count; i++) {
      const _w = _workers[i];
      if(_w && !_w.dead) continue;
      const worker = new Worker(_filename, {
        workerData: {
          index: i
        }
      });
      const _worker = {
        index: i,
        working: false,
        dead: false,
        worker,
        resolve: null,
        reject: null
      };
      _workers[i] = _worker;
      worker.on('message', d => {
        const {status, data} = d;
        if(status === 'success') {
          _worker.resolve(data);
        } else {
          _worker.reject(data);
        }
        self.reRun(_worker);
      });
      worker.on('error', data => {
        _worker.reject(`Thread ${_worker.index} error:\n${data.message || data})\n\nrestarting...`);
        _worker.worker.terminate();
        _worker.dead = true;
        self.initWorkers();
      });
      worker.on('exit', code => {
        _worker.reject(`Thread ${_worker.index} has exited, code=${code}, restarting...`);
        _worker.dead = true;
        self.initWorkers();
      });
      self.reRun(_worker);
    }
  }
  reRun(_worker) {
    const {_queue} = this;
    const task = _queue.pop();
    if(!task) return _worker.working = false;
    this.startWorker(_worker, task);
  }
  startWorker(_worker, task) {
    _worker.resolve = task.resolve;
    _worker.reject = task.reject;
    _worker.working = true;
    _worker.worker.postMessage(task.data);
  }
  run(data) {
    const self = this;
    const {_workers, _queue} = this;
    return new Promise((resolve, reject) => {
      const task = {
        resolve, 
        reject,
        data
      };
      for(const _worker of _workers) {
        if(_worker.working) continue;
        return self.startWorker(_worker, task);
      }
      _queue.unshift(task);
    });
  }
}