const NoteModel = require('./models/Note');
const { addSubNotes, getSubNote } = require('./helpers/utils');
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

    async getNote(queue) {
        const name = queue.dequeue();
        const root = await NoteModel.findOne({ name });
        
        if (!queue.isEmpty()) {
            return getSubNote(root, queue);
        }

        return root;
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