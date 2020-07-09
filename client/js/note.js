(function note() {
    
    document.addEventListener('DOMContentLoaded', init);

    let timeout = null;
    let interval = null;
    const savingInterval = 3000;

    function init() {
        document
            .querySelector('[data-note]')
            .addEventListener('input', onInput);
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
        console.log('SALVANDO');
        console.log(content);
    }
})()