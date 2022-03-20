(function nontes() {
    
    const offlineAlertAttribute = 'data-offline-alert';
    
    let isOnline = navigator.onLine;
    
    let serviceWorker;
    let swRegistration;

    if ('serviceWorker' in navigator) {
        initServiceWorker()
            .catch(console.error);
    }

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOfline);

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        if (!isOnline) {
            onOfline();
        }
    }

    async function initServiceWorker() {
        swRegistration = await navigator.serviceWorker.register('/sw.js', {
            updateViaCache: 'none'
        });

        serviceWorker = swRegistration.installing || swRegistration.waiting || swRegistration.active;
        sendStatusUpdate(serviceWorker);

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            serviceWorker = navigator.serviceWorker.controller
            sendStatusUpdate(serviceWorker);
        });
        
        navigator.serviceWorker.addEventListener('message', onServiceWorkerMessage);
    }

    function onServiceWorkerMessage(event) {
        let { data } = event;
        if (data.requestStatusUpdate) {
            sendStatusUpdate(event.ports && event.ports[0])
        }
    }

    function sendStatusUpdate(target) {
        sendServiceWorkerMessage({ statusUpdate: { isOnline } }, target);
    }

    function sendServiceWorkerMessage(message, target) {
        target = target || serviceWorker || navigator.serviceWorker.controller;
        target.postMessage(message);
    }

    function onOnline() {
        isOnline = true;
        removeOfflineAlert();
        sendStatusUpdate();
    }

    function onOfline() {
        isOnline = false;
        createOfflineAlert();
        sendStatusUpdate();
    }

    function createOfflineAlert() {
        const $offlineAlert = document.createElement('div');
        $offlineAlert.setAttribute(offlineAlertAttribute, '');
        $offlineAlert.classList.add('offline-alert');
        const closeAlertButtonAttribute = 'data-close-alert';
        const classPrefix = 'oa';
        $offlineAlert.innerHTML = `
            <div class="${classPrefix}-info">
                <h3 class="${classPrefix}-title">Você está offline, mas não se preocupe!</h3>
                <p class="${classPrefix}-text">
                    Suas notas estão sendo salvas neste dispositivo e serão atualizadas assim que a internet voltar.
                </p>
            </div>
            <button ${closeAlertButtonAttribute} type="button" class="${classPrefix}-close">
                <img src="assets/images/x.svg" alt="Icone de botão para fechar" width="15" height="15" />
            </button>
        `;

        document.body.appendChild($offlineAlert);

        document
            .querySelector(`[${closeAlertButtonAttribute}]`)
            .addEventListener('click', event => {
                event.preventDefault();
                removeOfflineAlert();
            });
    }

    function removeOfflineAlert() {
        const $alert = document.querySelector(`[${offlineAlertAttribute}]`);
        if ($alert) {
            $alert.remove();
        }
    }
})()
