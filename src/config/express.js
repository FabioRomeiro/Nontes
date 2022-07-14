const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const consign = require('consign');

app.use(express.static('./client/src'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

consign({ cwd: 'src' })
    .include('routes.js')
    .into(app);

module.exports = app;
