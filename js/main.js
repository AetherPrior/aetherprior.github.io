document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    if (typeof window.applyAIAgentAdvisory === "function") {
        window.applyAIAgentAdvisory();
    }

    const rbwElement = document.getElementById("rbw");
    let hue = 0;

    (function cycleColor() {
        if (rbwElement) {
            rbwElement.style.color = "hsl(" + hue + ", 80%, 60%)";
        }
        hue = (hue + 5) % 365;
        setTimeout(cycleColor, 40);
    })();
});

document.addEventListener('DOMContentLoaded', function () {
    const newsHeading = document.getElementById('news-heading');
    const newsContent = document.getElementById('news-content');

    if (!newsHeading || !newsContent) {
        return;
    }

    newsContent.classList.remove('show');

    newsHeading.addEventListener('click', function () {
        newsContent.classList.toggle('show');
        newsHeading.classList.toggle('active');
    });
});
