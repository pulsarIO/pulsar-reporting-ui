var connect = require('connect');
var serveStatic = require('serve-static');

var port = 9090;
connect().use(serveStatic('.', {index: ['index.html', 'index.htm']})).listen(port);
console.info('Server started at http://localhost:' + port);
