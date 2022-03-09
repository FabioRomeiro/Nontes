const NoteModel = require('./models/Note');

const methods = {
    async createNote(note) {
        return await NoteModel.create(note);
    },

    async updateNote(stack, content) {
        const note = await NoteModel.findOne({ name: stack.unstack() });
        note.content = content;
        note.save();
    },
    
    async getOrCreate(stack) {
        const noteName = stack.unstack();
        let note = await NoteModel.findOne({ name: noteName });
        if (!note) {
            note = await methods.createNote({
                name: noteName,
                content: '',
                subNotes: []
            });
            if (!stack.isEmpty()) {
                parent = await methods.getOrCreate(stack);
                parent.subNotes = [...parent.subNotes, note];
                parent.save();
            }
        }
        return note;
    }
}

module.exports = methods;
