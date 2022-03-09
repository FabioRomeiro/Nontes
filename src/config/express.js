const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const consign = require('consign');
const { engine } = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static('./src/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

consign({ cwd: 'src' })
    .include('routes.js')
    .into(app);

module.exports = app;
