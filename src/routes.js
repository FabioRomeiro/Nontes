const api = require('./api');
const path = require('path');
const Queue = require('./helpers/queue');
const render = require('./helpers/render');
const { subNotesToHTML } = require('./helpers/utils');

module.exports = app => {
    app.get('/favicon.ico', (req, res) => res.status(204).send());

    app.get('/', (req, res) => {
        res.send(render('index'));
    });

    app.get('/*', async (req, res) => {
        const path = req.params[0];
        const names = path.split('/');
        const namesQueue = new Queue(names);
        const note = await api.getOrCreateNote(namesQueue);
        // Eh gambi, eu sei, mas so ate achar um template engine legal, prometo sz
        let subNotesHTML = note.subNotes ? subNotesToHTML(note.subNotes, path) : '';
        res.send(render('note', {
            name: note.name,
            content: note.content,
            subNotesHTML
        }));
    });

    app.put('/update/*', (req, res) => {
        const content = req.body.content;
        const names = req.params[0].split('/');
        const namesQueue = new Queue(names);
        api.updateNote(namesQueue, content);
        res.status(200).send();
    });
};
