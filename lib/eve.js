const {Worker} = require("worker_threads");
module.exports = class {
  constructor(filename, count) {
    if(count < 1) throw 'count error';
    this._filename = filename;      
    this._workers = [];
    this._count = count;
    this._queue = [];
    this._destroyed = false;
    this.initWorkers();
  }
  initWorkers() {
    if(this._destroyed) return;
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
        if(self._destroyed) return;
        self.reRun(_worker);
      });
      worker.on('error', data => {
        if(self._destroyed) return;
        _worker.reject(`Thread ${_worker.index} error:\n${data.message || data})\n\nrestarting...`);
        _worker.worker.terminate();
        _worker.dead = true;
        self.initWorkers();
      });
      worker.on('exit', code => {
        if(self._destroyed) return;
        _worker.reject(`Thread ${_worker.index} has exited, code=${code}, restarting...`);
        _worker.dead = true;
        self.initWorkers();
      });
      self.reRun(_worker);
    }
  }
  reRun(_worker) {
    if(this._destroyed) return;
    const {_queue} = this;
    const task = _queue.pop();
    if(!task) return _worker.working = false;
    this.startWorker(_worker, task);
  }
  startWorker(_worker, task) {
    _worker.resolve = task.resolve;
    _worker.reject = task.reject;
    _worker.working = true;
    try{
      _worker.worker.postMessage(task.data);
    } catch(err) {
      _worker.reject(err);
    }
  }
  run(data) {
    if(this._destroyed) return Promise.reject(new Error('Thread pool destroyed'));
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
  destroy() {
    if(this._destroyed) return;
    this._destroyed = true;
    const {_workers, _queue} = this;

    while(_queue.length) {
      const task = _queue.pop();
      try {
        task && task.reject && task.reject(new Error('Thread pool destroyed'));
      } catch(_err) {}
    }

    for(const _worker of _workers) {
      if(!_worker) continue;
      if(_worker.working && _worker.reject) {
        try {
          _worker.reject(new Error('Thread pool destroyed'));
        } catch(_err) {}
      }
      if(_worker.worker) {
        try {
          _worker.worker.terminate();
        } catch(_err) {}
      }
      _worker.worker = null;
      _worker.resolve = null;
      _worker.reject = null;
    }

    this._workers = [];
    this._queue = [];
    this._filename = null;
    this._count = 0;
  }
}