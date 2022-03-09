(function note() {
    
    document.addEventListener('DOMContentLoaded', init);

    let timeout = null;
    let interval = null;
    const savingInterval = 3000;
    const url = new URL(location.href);
    const noteName = url.pathname.replace('/', '');

    const subNotesDataAttribute = 'data-subnotes';
    const openBtnDataAttribute = 'data-open-btn';

    function init() {
        const $noteTextarea = document.querySelector('[data-note-content]');
        $noteTextarea.addEventListener('input', onInput);
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

    function createList(items) {
        const $noteWrapper = document.querySelector('[data-nontes-note]');

        const $openBtn = document.createElement('button');
        $openBtn.setAttribute(openBtnDataAttribute, '');
        $openBtn.classList.add('nontes-note__open-btn');
        $openBtn.innerText = getOpenBtnText(true);

        const $subnoteList = document.createElement('ul');
        $subnoteList.classList.add('nontes-note__list');
        $subnoteList.setAttribute(subNotesDataAttribute, '');
        $subnoteList.appendChild($openBtn);

        for (const item of items) {
            const $subnoteLink = document.createElement('a');
            $subnoteLink.setAttribute('href', `/${noteName}/${item}`);
            $subnoteLink.innerText = item;
            
            const $subnoteItem = document.createElement('li');
            $subnoteItem.classList.add('nontes-note__item');
            $subnoteItem.appendChild($subnoteLink);

            $subnoteList.appendChild($subnoteItem);
        }

        $noteWrapper.insertBefore($subnoteList, $noteWrapper.childNodes[0]);

        document
            .querySelector(`[${openBtnDataAttribute}]`)
            .addEventListener('click', toggleList)
        document
            .querySelector(`[data-shadow]`)
            .addEventListener('click', toggleList)
    }

    function toggleList(event) {
        event.preventDefault();
        const isOpen = toggleSubNotesListClass();
        event.target.innerText = getOpenBtnText(!isOpen);
    }

    function toggleSubNotesListClass() {
        const $subnoteList = document.querySelector(`[${subNotesDataAttribute}]`);
        const openedClass = 'nontes-note__list--opened';
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
