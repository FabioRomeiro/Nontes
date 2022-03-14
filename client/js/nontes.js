(function nontes() {
    
    const offlineAlertAttribute = 'data-offline-alert';
    
    let isOnline = navigator.onLine;
    
    let serviceWorker;
    let swRegistration;

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        
        if ('serviceWorker' in navigator) {
            initServiceWorker()
                .catch(console.error);
        }
        
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOfline);

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
        const classBase = 'offline-alert';
        const $offlineAlert = document.createElement('div');
        $offlineAlert.setAttribute(offlineAlertAttribute, '');
        $offlineAlert.classList.add(classBase);
        const closeAlertButtonAttribute = 'data-close-alert';
        $offlineAlert.innerHTML = `
            <div class="${classBase}__icon">
                <img src="/assets/images/no-internet.svg" />
            </div>
            <div class="${classBase}__info">
                <h3 class="${classBase}__title">Você está offline, mas não se preocupe!</h3>
                <p class="${classBase}__text">
                    Suas notas estão sendo salvas neste dispositivo e serão atualizadas assim que a internet voltar.
                </p>
            </div>
            <div class="${classBase}__close-icon">
                <a ${closeAlertButtonAttribute} href></a>
            </div>
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
