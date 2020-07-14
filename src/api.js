const NoteModel = require('./models/Note');

const methods = {
    createNote(name) {
        NoteModel.create({ name, content: '' });
    },
    async updateNote(name, content) {
        const note = await NoteModel.findOne({ name });
        note.content = content;
        note.save();
    },
    getNote(name) {
        return NoteModel.findOne({ name });
    },
    noteExists(name) {
        return NoteModel.exists({ name });
    },
    async createIfDoesntExists(name) {
        if (!(await methods.noteExists(name))) {
            await methods.createNote(name);
        }
    }
}

module.exports = methods;