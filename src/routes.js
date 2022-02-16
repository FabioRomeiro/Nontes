const api = require('./api');
const path = require('path');
const Queue = require('./helpers/queue');

module.exports = app => {

    app.get('/*', (req, res) => {
        const names = req.params[0].split('/');
        const namesQueue = new Queue(names);

        if (req.query.data !== undefined) {
            api.getNote(namesQueue, !req.query.deep)
                .then(note => res.json(note));
        }
        else {
            api.createIfDoesntExists(namesQueue)
                .then(() => res.sendFile(path.resolve('client/note.html')));
        }
    });

    app.put('/update/*', (req, res) => {
        const content = req.body.content;
        const names = req.params[0].split('/');
        const namesQueue = new Queue(names);
        api.updateNote(namesQueue, content);
        res.status(200).send();
    });
};
