const render = require('./render');

render('./index.pug', {
  name: 'node-threads-pool',
  author: 'pengxiguaa'
})

.then(console.log)
.catch(console.error);