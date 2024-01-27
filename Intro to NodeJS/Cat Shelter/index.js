const http = require('http');
const fs = require('fs');
const queriString = require('querystring');

const cats = [
    {
        id: 1,
        name: 'Tommy',
        imageUrl: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg',
        breed: 'Bombay Cat',
        description: 'Dominant and aggressive to other cats. Will probably eat you in your sleep. Very cute tho.',
    },
    {
        id: 2,
        name: 'Navcho',
        imageUrl: 'https://www.thesprucepets.com/thmb/TU314sIYpY5NNX0trZmLBpbflb4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/persian-cats-gallery-4121944-hero-f5c237b8c6404655afb1e1bbae219ba5.jpg',
        breed: 'Persian Cat',
        description: 'They make a perfect, purring lap warmer!',
    },
    {
        id: 3,
        name: 'Naho',
        imageUrl: 'https://www.catster.com/wp-content/uploads/2023/11/oriental_siamese_cat_vivver_shutterstock.jpg.webp',
        breed: 'Siamise Cat',
        description: 'Siamese cats are highly social and enjoy the company of other cats and people. These cats become quite attached to their humans and follow them around like shadows.',
    },
];

const views = {
    home: './views/home.html',
    style: './views/site.css',
    addCat: './views/addCat.html',
    cat: './views/partials/cat.html'
}


const server = http.createServer((req, res) => {

    if (req.url === '/') {
        render(views.cat, cats, (err, catResult) => {
            if (err) {
                res.statusCode = 404;
                return res.end();
            }
            render(views.home, [{ cats: catResult }], (err, result) => {       //Callback hell!!!!!
                res.writeHead(200, {
                    'content-type': 'text/html',
                })
                res.write(result);
                res.end();
            })
        });
    } else if (req.url === '/styles/site.css') {
        fs.readFile(views.style, { encoding: 'utf-8' }, (err, result) => {
            if (err) {
                res.statusCode = 404;
                return res.end();
            }

            res.writeHead(200, {
                'content-type': 'text/css'
            })
            res.write(result);
            res.end();
        });
    } else if (req.url === '/cats/add-cat' && req.method === 'GET') {
        fs.readFile(views.addCat, { encoding: 'utf-8' }, (err, result) => {
            if (err) {
                res.statusCode = 404;
                return res.end();
            }

            res.writeHead(200, {
                'content-type': 'text/html',
            })
            res.write(result);
            res.end();
        });
    } else if (req.url === '/cats/add-cat' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('close', () => {
            const parsedBody = queriString.parse(body);
            parsedBody.id = cats[cats.length - 1].id + 1;

            cats.push(parsedBody)
            console.log(parsedBody);

            res.writeHead(302, {
                'location': '/'
            });
            res.end();
        })
    } else {
        res.writeHead(200, {
            'content-type': 'text/html',
        })
        res.write('<h1>404</>');
        res.end();
    }
});

function render(view, dataArr, callback) {
    fs.readFile(view, 'utf-8', (err, result) => {
        if (err) {
            return callback(err);
        }

        const htmlResult = dataArr.map(data => {
            return Object.keys(data).reduce((acc, key) => {
                const pattern = new RegExp(`{{${key}}}`, 'g')
                return acc.replace(pattern, data[key]);
            }, result);
        }).join('\n');

        callback(null, htmlResult);


    });

};

server.listen(1000);
console.log('Server is listening on port 1000....')
