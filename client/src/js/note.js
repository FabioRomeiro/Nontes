(function note() {
    
    let timeout = null;
    let interval = null;
    const savingInterval = 3000;
    const url = new URL(location.href);
    const noteName = url.pathname.replace('/', '');

    let $subnotesWrapper;

    (async function init() {
        const note = await getNote(noteName);

        const $noteContent = document.querySelector('[data-note-content]');
        $noteContent.textContent = note.content;

        $noteContent.addEventListener('input', onInput);

        setHeadMetatags();
       
        if (note.subnotes.length) {
            $subnotesWrapper = renderSubnotes(note.subnotes);
            setupSubnotesEventListeners();
        }
 
        if ('serviceWorker' in navigator) {
            requestSubnotesPreload()
        }
    })();

    async function getNote(noteName) {
        return new Promise((resolve, reject) => {
            resolve({
                content: 'aaaaaaaaaaaa',
                subnotes: ['b', 'c']
            })
        });
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

    function save(content) {
        fetch(`/update/${noteName}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
    }
    
    function setHeadMetatags() {
        document.title = `${noteName} - Nontes`;
        document.querySelector('link[rel="canonical"]').setAttribute('href', url.href);
    }

    function renderSubnotes(subnotes) {
        const $items = subnotes.map(note => {
            const $a = document.createElement('a');
            $a.setAttribute('href', `${url.href}/${note}`);
            $a.setAttribute('title', note);
            $a.textContent = note;

            const $li = document.createElement('li');
            $li.classList.add('nnsl-item');
            $li.setAttribute('data-subnotes-item', '');
            $li.append($a);

            return $li;
        });

        const $list = document.createElement('ul');
        $list.classList.add('nns-list');
        $list.append(...$items);

        const $button = document.createElement('button');
        $button.classList.add('nns-btn');
        $button.setAttribute('data-open-btn', '');
        $button.textContent = getSubnotesButtonText(false);

        const $subnotes = document.createElement('div');
        $subnotes.classList.add('nn-subnotes');
        $subnotes.setAttribute('data-subnotes', '');
        $subnotes.append($list, $button);
        
        document.querySelector('[data-nontes-note]').prepend($subnotes);

        return $subnotes;
    }

    function toggleSubNotesList(event) {
        event.preventDefault();
        const openedAttribute = 'opened';
        $subnotesWrapper.toggleAttribute(openedAttribute);
        const isOpen = $subnotesWrapper.hasAttribute(openedAttribute);
        const btnText = getSubnotesButtonText(isOpen);
        event.target.innerText = btnText;
    }

    function getSubnotesButtonText(isOpen) {
        return isOpen ? 'Esconder sub-notas' : 'Ver sub-notas';
    }

    function setupSubnotesEventListeners() {
        document
            .querySelector('[data-open-btn]')
            .addEventListener('click', toggleSubNotesList)
        document
            .querySelector('[data-shadow]')
            .addEventListener('click', toggleSubNotesList)
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
})()
