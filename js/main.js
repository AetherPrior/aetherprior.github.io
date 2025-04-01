document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    function mainModule() {
        var rbwElement = document.getElementById("rbw");
        var hue = 0;
        var eventType = ("ontouchstart" in window) ? "touchend" : "click";
        var classActions = ["remove", "add"];
        var buttonLabels = [
            "More contrast",
            "Less contrast",
            "Light mode",
            "Dark mode"
        ];
        var buttonIcons = [
            '<img src="images/contrast.svg" alt="high contrast" width="15" height="15"> ',
            '<img src="images/contrast.svg" alt="less contrast" width="15" height="15"> ',
            '<img src="images/light.svg" alt="light mode" width="15" height="15"> ',
            '<img src="images/dark.svg" alt="dark mode" width="15" height=15"> '
        ]

        function attachToggle(buttonId, labels, toggleClass, icons) {
            var htmlElement = document.getElementsByTagName("html")[0];
            var button = document.getElementById(buttonId);
            var toggled = false;
          
            button.addEventListener(eventType, function() {
              toggled = !toggled;
              var stateIndex = Number(toggled);
              // Combine icon and label together:
              button.innerHTML = icons[stateIndex] + " " + labels[stateIndex];
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

        attachToggle("contrast", [buttonLabels[0], buttonLabels[1]], "contrast", [buttonIcons[0], buttonIcons[1]]);
        attachToggle("invmode", [buttonLabels[2], buttonLabels[3]], "inverted", [buttonIcons[2], buttonIcons[3]]);
    }

    var modules = { 460: mainModule };

    function require(moduleId) {
        var module = { exports: {} };
        modules[moduleId](module, module.exports, require);
        return module.exports;
    }

    require(460);
});
