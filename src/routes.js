const api = require('./api');
const path = require('path');

module.exports = app => {

    app.get('*', (req, res) => {
        const name = req.params[0].replace('/', '');

        if (req.query.data !== undefined) {
            api.getNote(name).then(note =>
                res.json(note.content));
        }
        else {
            api.createIfDoesntExists(name).then(() =>
                res.sendFile(path.resolve('client/note.html')));
        }
    });

    app.put('/update/:noteName', (req, res) => {
        const content = req.body.content;
        const noteName = req.params.noteName;
        api.updateNote(noteName, content);
        res.status(200).send();
    });
};