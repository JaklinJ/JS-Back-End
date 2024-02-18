const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const routes = require('./routes');
const { authMiddleware } = require('./middlewares/authMiddleware')

const app = express();

app.use(express.static(__dirname)); ///static middleware
app.use(express.urlencoded({ extended: true })); //body parser (req.body)  
app.use(cookieParser());
app.use(authMiddleware);


app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');

app.use(routes);

mongoose.connect('mongodb://localhost:27017/earth-treasures');

mongoose.connection.on('connected', () => console.log('DB is connected'));
mongoose.connection.on('error', (err) => console.log(err));
mongoose.connection.on('disconnect', () => console.log('DB is disconnected'));

app.listen(3000, () => console.log("App is listening on port 3000......"));