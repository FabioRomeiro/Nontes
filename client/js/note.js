(function note() {
    
    document.addEventListener('DOMContentLoaded', init);

    let timeout = null;
    let interval = null;
    const savingInterval = 3000;
    const noteName = location.href.split("/")[3];

    async function init() {
        fetch(`${noteName}?data`)
            .then(res => res.json())
            .then(content => {
                const $noteTextarea = document.querySelector('[data-note]');
                $noteTextarea.value = content;
                $noteTextarea.addEventListener('input', onInput);
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