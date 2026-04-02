(function () {
    'use strict';

    var buffer = '';
    var msg    = document.getElementById('easter-egg-msg');

    document.addEventListener('keydown', function (e) {
        if (!msg || e.key.length !== 1) { return; }
        buffer = (buffer + e.key).slice(-10);
        if (buffer.toLowerCase().includes('help')) {
            msg.textContent = '> Acc\u00e8s refus\u00e9. Mais entre nous : il n\u2019y a rien d\u2019int\u00e9ressant ici. Vraiment.';
            msg.classList.add('visible');
        }
    });
}());
