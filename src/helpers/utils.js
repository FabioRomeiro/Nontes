module.exports = {
    subNotesToHTML (subNotes, path) {
        let $li = subNotes.map(n => `
            <li class="nnl-item" data-subnotes-item>
                <a href="/${path}/${n.name}">${n.name}</a>
            </li>
        `).join('');
        return `
            <ul class="nn-list" data-subnotes>
                ${$li}
                <button class="nnl-btn" data-open-btn>
                    Ver sub-notas
                </button> 
            </ul>
        `;
    }
}
