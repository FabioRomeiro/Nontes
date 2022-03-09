const api = require('./api');
const path = require('path');
const Stack = require('./helpers/stack');

module.exports = app => {

    app.get('/', (req, res) => {
        return res.render('index', {
            title: 'Nontes - Anote rápido e em qualquer lugar',
            style: 'landing.css'
        });
    });

    app.get('/*', async (req, res) => {
        const names = req.params[0].split('/');
        const namesStack = new Stack(names);

        const note = await api.getOrCreate(namesStack);
        return res.render('note', {
            content: note.content,
            title: `${note.name} - Nontes`,
            style: 'note.css'
        })
    });

    app.put('/update/*', (req, res) => {
        const content = req.body.content;
        const names = req.params[0].split('/');
        const namesStack = new Stack(names);
        api.updateNote(namesStack, content);
        res.status(200).send();
    });
};
