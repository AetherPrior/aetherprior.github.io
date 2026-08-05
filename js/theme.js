(function () {
    'use strict';

    var script = document.currentScript;
    var imageBase = script ? script.src.replace(/\/js\/[^\/]*$/, '/images/') : 'images/';
    var root = document.documentElement;
    var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    // `.inverted` means "opposite of whatever the system asked for", so the
    // button labels have to be derived rather than just flipped on click.
    function isDark() {
        var systemDark = darkQuery ? darkQuery.matches : false;
        return root.classList.contains('inverted') ? !systemDark : systemDark;
    }

    function render(id, icon, label) {
        var button = document.getElementById(id);
        if (!button) {
            return;
        }

        button.innerHTML = '<img src="' + imageBase + icon + '" width="15" height="15" alt=""> ' + label;
    }

    function syncButtons() {
        var dark = isDark();
        render('invmode', dark ? 'light.svg' : 'dark.svg', dark ? 'Light mode' : 'Dark mode');
        render('contrast', 'contrast.svg', root.classList.contains('contrast') ? 'Less contrast' : 'More contrast');
    }

    function toggleContrast() {
        root.classList.toggle('contrast');
        syncButtons();
    }

    function toggleInvert() {
        root.classList.toggle('inverted');
        syncButtons();
    }

    window.toggleContrast = toggleContrast;
    window.toggleInvert = toggleInvert;

    function initialize() {
        var contrastButton = document.getElementById('contrast');
        var invertButton = document.getElementById('invmode');

        if (contrastButton) {
            contrastButton.addEventListener('click', toggleContrast);
        }

        if (invertButton) {
            invertButton.addEventListener('click', toggleInvert);
        }

        if (darkQuery) {
            if (darkQuery.addEventListener) {
                darkQuery.addEventListener('change', syncButtons);
            } else if (darkQuery.addListener) {
                darkQuery.addListener(syncButtons);
            }
        }

        syncButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
