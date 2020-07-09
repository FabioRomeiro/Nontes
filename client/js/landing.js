(function landing() {
    

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        document
            .querySelector('[data-note-form]')
            .addEventListener('submit', submit);
    }

    function submit(event) {
        event.preventDefault();
        const noteName = document.querySelector('[data-note-name]').value;
        window.location.href = `/${noteName}`;
    }
})();