const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
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
                    message + '|',
                    {flag: 'a'},
                    (err) => {
                        res.setHeader('Location', '/');
                        res.statusCode = err ? 500 : 302;
                        return res.end();
                    });
            });
    }
}

// module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some Text'
// };
// exports is shortcut of module.exports
exports.handler = requestHandler;
exports.someText = 'Some Text';
