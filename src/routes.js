const api = require('./api');
const path = require('path');
const Queue = require('./helpers/queue');

module.exports = app => {
    app.get('/favicon.ico', (req, res) => res.status(204));

    app.get('/', (req, res) => {
        res.render('index', {
            title: 'Nontes - Anote rápido e em qualquer lugar',
            style: 'landing.css'
        });
    });

    app.get('/*', async (req, res) => {
        const path = req.params[0];
        const names = path.split('/');
        const namesQueue = new Queue(names);
        const note = await api.getOrCreateNote(namesQueue);
        res.render('note', {
            notePath: path,
            content: note.content,
            subNotes: note.subNotes.map(subNote => subNote.name),
            hasSubNotes: note.subNotes.length > 0,
            title: `${note.name} - Nontes`,
            style: 'note.css'
        })
    });

    app.put('/update/*', (req, res) => {
        const content = req.body.content;
        const names = req.params[0].split('/');
        const namesQueue = new Queue(names);
        api.updateNote(namesQueue, content);
        res.status(200).send();
    });
};
