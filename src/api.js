const NoteModel = require('./models/Note');

const methods = {
    async createOrUpdateNote(note) {
        if (note instanceof NoteModel) {
            note.save();
        }
        else {
            NoteModel.create(note);
        }
    },

    async updateNote(queue, content) {
        const root = await NoteModel.findOne({ name: queue.dequeue() });
        let note = root;
        if (!queue.isEmpty()) {
            note = methods.getOrCreateSubNote(root, queue);
        }
        note.content = content;
        root.save();
    },

    getOrCreateSubNote(root, queue) {
        if (queue.isEmpty()) {
            return root;
        }

        const subNoteName = queue.dequeue();
        let subNote = root.subNotes.find(note => note.name === subNoteName);
        if (!subNote) {
            subNote = {
                name: subNoteName,
                content: '',
                subNotes: []
            };
            root.subNotes.push(subNote);
        }

        return methods.getOrCreateSubNote(subNote, queue);
    },
    
    async getOrCreateNote(queue) {
        const rootName = queue.dequeue();
        let root = await NoteModel.findOne({ name: rootName })
        const rootExists = !!root;
        if (!rootExists) {
            root = {
                name: rootName,
                content: '',
                subNotes: []
            };
        }

        const note = methods.getOrCreateSubNote(root, queue);

        methods.createOrUpdateNote(root);

        return note;
    }
}

module.exports = methods;

