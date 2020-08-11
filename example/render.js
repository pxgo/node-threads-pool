const pug = require('pug');
const os = require('os');
const {Eve, Thread, isMainThread} = require('../index');

async function threadFunc() {
  const options = {};
  new Thread(_data => {
    const {template, data} = _data;
    options.data = data;
    return pug.renderFile(template, options);
  });
}

if(!isMainThread) {
  threadFunc();
} else {
  const tp = new Eve(__filename, os.cpus().length);
  module.exports = async (template, data) => {
    return await tp.run({
      template, data
    });
  };
}