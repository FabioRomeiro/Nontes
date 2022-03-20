module.exports = {
    subNotesToHTML (subNotes, path) {
        let $li = subNotes.map(n => `
            <li class="nnsl-item" data-subnotes-item >
                <a href="/${path}/${n.name}" title="${n.name}">${n.name}</a>
            </li>
        `).join('');
        return `
            <div class="nn-subnotes" data-subnotes>
                <ul class="nns-list">
                    ${$li}
                </ul>
                <button class="nns-btn" data-open-btn>
                    Ver sub-notas
                </button> 
            </div>
        `;
    }
}
