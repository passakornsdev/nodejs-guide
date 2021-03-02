const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.write('Welcome to the simplest web!');
    res.end();
});

server.listen(3000);
