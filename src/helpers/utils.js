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
    }
};

module.exports = utils;