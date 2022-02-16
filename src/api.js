const NoteModel = require('./models/Note');
const { addSubNotes, getSubNote, getNotesNames: getChildrenNames } = require('./helpers/utils');
const Queue = require('./helpers/queue');

const methods = {
    async createNote(note) {
        await NoteModel.create(note);
    },

    async updateNote(queue, content) {
        const root = await NoteModel.findOne({ name: queue.dequeue() });
        let note = root;

        if (!queue.isEmpty()) {
            note = getSubNote(note, queue);
        }
        
        note.content = content;
        root.save();
    },

    async getNote(queue, subNotesNamesOnly) {
        const name = queue.dequeue();
        const root = await NoteModel.findOne({ name });
        let note = root;
        
        if (!queue.isEmpty()) {
            note = getSubNote(root, queue);
        }

        if (subNotesNamesOnly) {
            note = note.toObject();
            note.subNotes = getChildrenNames(note.subNotes);
        }

        return note;
    },
    
    async createIfDoesntExists(queue) {
        const rootName = queue.dequeue();
        let rootNote = await methods.getNote(new Queue([rootName]));
        if (!rootNote) {
            rootNote = {
                name: rootName,
                content: '',
                subNotes: []
            }
        }
        addSubNotes(rootNote, queue);
        await methods.createNote(rootNote);
    }
}

module.exports = methods;
