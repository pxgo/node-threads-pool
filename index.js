const {isMainThread} = require("worker_threads");

module.exports = {
  Eve: require('./lib/eve'),
  Adam: require('./lib/adam'),
  Thread: require('./lib/thread'),
  isMainThread
}