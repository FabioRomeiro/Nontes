const utils = {
    addSubNotes(root, queue) {
        
        if (queue.isEmpty()) {
            return;
        }

        const childName = queue.dequeue();
        let child = root.subNotes.filter(note => note.name === childName)[0];
        if (!child) {
            child = {
                name: childName,
                content: '',
                subNotes: []
            };
            root.subNotes.push(child);
        }

        return utils.addSubNotes(child, queue);
    },

    getSubNote(root, queue) {
        const name = queue.dequeue();
        const subNote = root.subNotes.filter(note => note.name === name)[0];

        if (!queue.isEmpty()) {
            return utils.getSubNote(subNote, queue);
        }

        return subNote;
    },

    getNotesNames(notes) {
        return notes.map(note => note.name);
    },

    limitSubNotesDepth(note, maxDepth, currentDepth = 0) {
        if (!note.subNotes.length || currentDepth === maxDepth) {
            note.subNotes = note.subNotes.map(subnote => subnote.name);
            return note;
        }
        note.subNotes = note.subNotes.map(subnote =>
            utils.limitSubNotesDepth(subnote, maxDepth - 1, currentDepth + 1))
        return note;
    }
};

module.exports = utils;
