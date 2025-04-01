   // Print function that uses browser's print dialog
   function printCV() {
    // Switch to light theme for printing
    const currentTheme = document.body.getAttribute("data-theme");
    if (currentTheme === "dark") {
        document.body.removeAttribute("data-theme");
    }
    
    // Print and then restore theme
    window.print();
    
    if (currentTheme === "dark") {
        setTimeout(() => {
            document.body.setAttribute("data-theme", "dark");
        }, 500); // Small delay to ensure print dialog has appeared
    }
}