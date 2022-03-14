const fs = require('fs')
const _ = require('lodash');

module.exports = function render (fileName, context) {
    return _.template(fs.readFileSync(`./client/${fileName}.html`))(context)
}

