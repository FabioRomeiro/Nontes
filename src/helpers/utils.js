module.exports = {
    subNotesToHTML (subNotes, path) {
        let $li = subNotes.map(n => `
            <li class="nontes-note__item" data-subnotes-item>
                <a href="/${path}/${n.name}">${n.name}</a>
            </li>
        `).join('');
        return `
            <ul class="nontes-note__list" data-subnotes>
                ${$li}
                <button class="nontes-note__open-btn" data-open-btn>
                    Ver sub-notas
                </button> 
            </ul>
        `;
    }
}
