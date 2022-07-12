const api = require('./api');
const path = require('path');
const Queue = require('./helpers/queue');

module.exports = app => {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('client/src/index.html'));
    });

    app.get('/*', async (req, res, next) => {
        const names = req.params[0].split('/');
        const namesQueue = new Queue(names);

        if (req.query.json === undefined) {
            res.sendFile(path.resolve('client/src/note.html'));
            return;
        }

        res.json(await api.getOrCreateNote(namesQueue));
    });

    app.put('/update/*', (req, res) => {
        const content = req.body.content;
        const names = req.params[0].split('/');
        const namesQueue = new Queue(names);
        api.updateNote(namesQueue, content);
        res.status(200).send();
    });
};
