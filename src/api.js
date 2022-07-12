const NoteModel = require('./models/Note');

function getNoteObject(name='', content='', subnotes=[]) {
    return { name, content, subnotes };
}

function getOrCreateSubnote(root, queue) {
    if (queue.isEmpty()) {
        return getNoteObject(root.name, root.content, root.subnotes.map(note => note.name));
    }

    const subnoteName = queue.dequeue();
    let subnote = root.subnotes.find(note => note.name === subnoteName);
    if (!subnote) {
        subnote = getNoteObject(subnoteName);
        root.subnotes.push(subnote);
    }

    return getOrCreateSubnote(subnote, queue);
}
    
async function createOrUpdateNote(note) {
    if (note instanceof NoteModel) {
        note.save();
        return
    }

    NoteModel.create(note);
}

module.exports = {
    async updateNote(queue, content) {
        const root = await NoteModel.findOne({ name: queue.dequeue() });
        let note = root;
        if (!queue.isEmpty()) {
            note = getOrCreateSubnote(root, queue);
        }
        note.content = content;
        root.save();
    },

    async getOrCreateNote(queue) {
        const rootName = queue.dequeue();
        let root = await NoteModel.findOne({ name: rootName })
        const rootExists = !!root;
        if (!rootExists) {
            root = getNoteObject(rootName);
        }

        const note = getOrCreateSubnote(root, queue);

        createOrUpdateNote(root);

        return note;
    }
};

