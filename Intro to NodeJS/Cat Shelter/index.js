const http = require('http');
const homeTemplate = require('./viewsHtmls/home');
const siteCss = require('./viewsHtmls/site.css');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, {
            'content-type' : 'text/html',
        })
        res.write(homeTemplate)
        res.end()
    } else if (req.url === '/styles/site.css') {
        res.writeHead(200, {
            'content-type' : 'text/css'
        })
        res.write(siteCss);
        res.end();
    }
});

server.listen(1000);
console.log('Server is listening on port 1000....')