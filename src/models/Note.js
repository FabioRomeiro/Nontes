const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema();
NoteSchema.add({
    name: { type: String, unique: true, trim: true },
    content: String,
    subNotes: [NoteSchema]
});

module.exports = mongoose.model('Note', NoteSchema);