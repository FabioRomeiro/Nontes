(function note() {
    
    document.addEventListener('DOMContentLoaded', init);

    let timeout = null;
    let interval = null;
    const savingInterval = 3000;
    const url = new URL(location.href);
    const noteName = url.pathname.replace('/', '');

    let $subnoteList;

    function init() {
        $subnoteList = document.querySelector('[data-subnotes]');

        document
            .querySelector('[data-note-content]')
            .addEventListener('input', onInput);
       
        document
            .querySelector('[data-open-btn]')
            .addEventListener('click', toggleSubNotesList)
        document
            .querySelector('[data-shadow]')
            .addEventListener('click', toggleSubNotesList)
        
        if ('serviceWorker' in navigator) {
            requestSubnotesPreload()
        }
    }

    async function requestSubnotesPreload() {
        const $subNotes = document.querySelectorAll('[data-subnotes-item]');
        if (!$subNotes.length) {
            return;
        }
        const subNotes = Array.from($subNotes, subNote => subNote.textContent.trim());
        const target = navigator.serviceWorker.controller;
        target.postMessage({
            preloadSubnotes: {
                path: location.pathname,
                subNotes
            } 
        });
    }

    function onInput(event) {
        removeTimeout();

        if (!interval) {
            interval = setInterval(() => {
                save(event.target.value);
                createTimeout();
            }, savingInterval);
        }
    }

    function removeTimeout() {
        clearTimeout(timeout);
        timeout = null;
    }

    function removeInterval() {
        clearInterval(interval);
        interval = null;
    }

    function createTimeout() {
        timeout = setTimeout(() => {
            removeInterval();
        }, savingInterval * 2);
    }

    function toggleSubNotesList(event) {
        event.preventDefault();
        const isOpen = toggleSubNotesListClass();
        event.target.innerText = getOpenBtnText(!isOpen);
    }

    function toggleSubNotesListClass() {
        const openedClass = 'nn-list--opened';
        $subnoteList.classList.toggle(openedClass);
        return $subnoteList.classList.contains(openedClass)
    }

    function getOpenBtnText(closed) {
        return closed ? 'Ver sub-notas' : 'Esconder sub-notas';
    }

    function save(content) {
        fetch(`/update/${noteName}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
    }
})()
