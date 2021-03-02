const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    console.log(req.body, req.method, req.url);
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.write('<html>' +
            '<title>Sample web app</title>' +
            '<body><form action="/message" method="post"><input type="text" name="message"><button type="submit">send a message</button></form></body>' +
            '</html>');
        return res.end();
    } else if (url === '/message' && method === 'POST') {
        // event driven architecture, data -> end -> fs.write
        const body = [];
        // listen to particular event
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', // fire once nodejs finish parsing req
            () => {
                const parsedBody = Buffer
                    .concat(body) //  create new buffer and add all chunk to buffer
                    .toString();
                const message = parsedBody.split('=')[1];
                fs.writeFile('./tmp/message.txt',
                    message,
                    {flag: 'a'},
                    (err) => {
                        res.setHeader('Location', '/');
                        res.statusCode = err ? 500 : 302;
                        return res.end();
                    });
            });
    }
});

server.listen(3000);
