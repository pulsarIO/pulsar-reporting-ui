var connect = require('connect');
var serveStatic = require('serve-static');

// Src folder
var srcPort = 9191;
connect().use(serveStatic('../app/', {index: ['index.html', 'index.htm']})).listen(srcPort);
console.info('Server (src) started at http://localhost:' + srcPort);

// Dist folder
var distPort = 9192;
connect().use(serveStatic('../dist/', {index: ['index.html', 'index.htm']})).listen(distPort);
console.info('Server (minified/distribution) available at http://localhost:' + distPort);

// Docs
var docsPort = 9193;
connect().use(serveStatic('../docs/', {index: ['index.html', 'index.htm']})).listen(docsPort);
console.info('Docs available at http://localhost:' + docsPort);