const http = require('http');
const url = require('url');
const fs = require('fs');

const app = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.setHeader('Content-Type', 'text/html');

    if (pathname === '/calc') {
        const { operation, a, b } = query;
        const numA = Number(a);
        const numB = Number(b);

        let result;
        if (operation === 'add') {
            result = numA + numB;
        } else if (operation === 'sub') {
            result = numA - numB;
        } else if (operation === 'mul') {
            result = numA * numB;
        } else if (operation === 'div') {
            result = numA / numB;
        } else {
            res.statusCode = 400;
            res.end('Operation unknown');
            return;
        }

        res.statusCode = 200;
        res.end(String(result));
    } else if (pathname === '/fs') {
        const { operation, filename, text } = query;

        if (operation === 'create') {
            fs.writeFileSync(filename, text || '');
            res.statusCode = 201;
            res.end(`${filename} was created`);
        } else if (operation === 'read') {
            if (fs.existsSync(filename)) {
                const content = fs.readFileSync(filename, 'utf8');
                res.statusCode = 201;
                res.end(content);
            } else {
                res.statusCode = 400;
                res.end('File not found');
            }
        } else {
            res.statusCode = 400;
            res.end('Operation unknown');
        }
    } else {
        res.statusCode = 400;
        res.end('Operation unknown');
    }
});

module.exports = app;
