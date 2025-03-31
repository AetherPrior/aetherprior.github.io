document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    function mainModule() {
        var rbwElement = document.getElementById("rbw");
        var hue = 0;
        var eventType = ("ontouchstart" in window) ? "touchend" : "click";
        var classActions = ["remove", "add"];
        var buttonLabels = [
            "Add more contrast",
            "Remove additional contrast",
            "Inverted mode",
            "Normal mode"
        ];

        function attachToggle(buttonId, labels, toggleClass) {
            var htmlElement = document.getElementsByTagName("html")[0];
            var button = document.getElementById(buttonId);
            var textNode = button.firstChild;
            var toggled = false;

            button.addEventListener(eventType, function() {
                toggled = !toggled;
                var stateIndex = Number(toggled);
                textNode.data = labels[stateIndex];
                htmlElement.classList[classActions[stateIndex]](toggleClass);
            }, false);
        }

        (function cycleColor() {
            var color = "hsl(" + hue + ", 80%, 60%)";
            hue += 5;
            if (hue > 360) hue = 0;
            if (rbwElement) rbwElement.style.color = color;
            setTimeout(cycleColor, 40);
        })();

        attachToggle("contrast", [buttonLabels[0], buttonLabels[1]], "contrast");
        attachToggle("invmode", [buttonLabels[2], buttonLabels[3]], "inverted");
    }

    var modules = { 460: mainModule };

    function require(moduleId) {
        var module = { exports: {} };
        modules[moduleId](module, module.exports, require);
        return module.exports;
    }

    require(460);
});
