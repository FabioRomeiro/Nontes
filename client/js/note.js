(function note() {
    
    let timeout = null;
    let interval = null;
    const savingInterval = 3000;
    const url = new URL(location.href);
    const noteName = url.pathname.replace('/', '');

    let $subnotesWrapper;
    const subNotesClass = 'nn-subnotes';
    const openedSufix = '--opened';

    (function init() {
        document
            .querySelector('[data-note-content]')
            .addEventListener('input', onInput);

        $subnotesWrapper = document.querySelector('[data-subnotes]');
        if ($subnotesWrapper) {
            document
                .querySelector('[data-open-btn]')
                .addEventListener('click', toggleSubNotesList)
            document
                .querySelector('[data-shadow]')
                .addEventListener('click', toggleSubNotesList)
        }
 
        if ('serviceWorker' in navigator) {
            requestSubnotesPreload()
        }
    })();

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
        const openedClass = subNotesClass + openedSufix;
        $subnotesWrapper.classList.toggle(openedClass);
        const isOpen = $subnotesWrapper.classList.contains(openedClass);
        const btnText = isOpen ? 'Esconder sub-notas' : 'Ver sub-notas';
        event.target.innerText = btnText;
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
