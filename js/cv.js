// Modified to avoid localStorage in sandboxed environments
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Use prefers-color-scheme as the default since we can't use localStorage
if (prefersDarkScheme.matches) {
    document.body.setAttribute("data-theme", "dark");
}

// Advanced mobile and high-resolution display detection for CV site
document.addEventListener('DOMContentLoaded', function () {
    // Initialize UI based on current device
    updateUIForDevice();

    // Handle window resize events
    window.addEventListener('resize', updateUIForDevice);
});

/**
 * Updates the UI based on device characteristics
 */
function updateUIForDevice() {
    const isMobileDevice = checkIfMobile();
    const isHighResolution = checkIfHighResolution();

    // Get UI elements
    const toggleVisButton = document.querySelector('.theme-toggle-container button:nth-child(2)');
    const darkModeButton = document.querySelector('.theme-toggle-container button:first-child');
    const exportButtons = document.querySelector('.export-buttons');

    if (isMobileDevice) {
        // Handle mobile-specific UI adjustments
        if (toggleVisButton) toggleVisButton.style.display = 'none';
        if (exportButtons) exportButtons.style.display = 'none';

        if (darkModeButton) {
            // Update dark mode button text and style
            if (isHighResolution) {
                // Enhanced text and icon for high-res displays
                darkModeButton.innerHTML = '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
                darkModeButton.classList.add('high-res');
            } else {
                // Standard mobile text
                darkModeButton.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
                darkModeButton.classList.remove('high-res');
            }
        }
    } else {
        // Reset to desktop UI
        if (toggleVisButton) toggleVisButton.style.display = '';
        if (exportButtons) exportButtons.style.display = '';

        if (darkModeButton) {
            darkModeButton.innerHTML = '<i class="fas fa-moon"></i> Light/Dark Mode';
            darkModeButton.classList.remove('high-res');
        }
    }
}

/**
 * Checks if the current device is a mobile device
 * @returns {boolean} true if device is mobile
 */
function checkIfMobile() {
    return window.innerWidth <= 768;
}

/**
 * Checks if the current device has a high-resolution display
 * @returns {boolean} true if device has high-resolution display
 */
function checkIfHighResolution() {
    // Check various device pixel ratio properties for cross-browser support
    return (
        (window.devicePixelRatio !== undefined && window.devicePixelRatio >= 2.5) ||
        (window.matchMedia && window.matchMedia('(min-resolution: 2.5dppx)').matches) ||
        (window.matchMedia && window.matchMedia('(min-resolution: 402dpi)').matches)
    );
}

/**
 * Toggle visibility of export buttons
 * (This will still be called from HTML but won't show on mobile)
 */
function toggleVis() {
    const exportButtons = document.querySelector('.export-buttons');
    if (exportButtons) {
        const currentDisplay = window.getComputedStyle(exportButtons).display;
        exportButtons.style.display = currentDisplay === 'none' ? 'flex' : 'none';
    }
}

// Function to detect user's region and suggest appropriate paper size
function detectRegion() {
    const language = navigator.language || navigator.userLanguage;
    const isUS = language && (language.includes('US') || language.includes('us'));
    return isUS ? 'letter' : 'a4';
}

/**
* Toggle theme between light and dark mode
*/
function toggleTheme() {
    // Toggle the dark-mode class on the body
    document.body.classList.toggle('dark-mode');

    // Get the current state after toggle
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Update icon based on current theme
    const darkModeButton = document.querySelector('.theme-toggle-container button:first-child i');
    if (darkModeButton) {
        darkModeButton.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

    // Set the data-theme attribute on both html and body for consistency
    document.querySelector('html').setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    // Apply additional class-based styling if needed
    if (isDarkMode) {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }

    // console.log("Theme toggled:", isDarkMode ? "dark mode" : "light mode");
}

/**
 * Initialize theme based on saved preference - DEFAULTS TO DARK MODE
 */
function initializeTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('darkMode');

    // If user explicitly chose light mode, use it
    if (savedTheme === 'disabled') {
        document.body.classList.remove('dark-mode');
        document.body.setAttribute('data-theme', 'light');
        document.querySelector('html').setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark-theme');

        // Update the icon to moon (for switching to dark)
        const darkModeIcon = document.querySelector('.theme-toggle-container button:first-child i');
        if (darkModeIcon) {
            darkModeIcon.className = 'fas fa-moon';
        }
    } else {
        // DEFAULT TO DARK MODE (either saved as 'enabled' or no preference)
        document.body.classList.add('dark-mode');
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('html').setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark-theme');

        // Update the icon to sun (for switching to light)
        const darkModeIcon = document.querySelector('.theme-toggle-container button:first-child i');
        if (darkModeIcon) {
            darkModeIcon.className = 'fas fa-sun';
        }

        // Save the preference if it wasn't already saved
        if (savedTheme !== 'enabled') {
            localStorage.setItem('darkMode', 'enabled');
        }
    }
}

// Initialize theme when the page loads
document.addEventListener('DOMContentLoaded', initializeTheme);