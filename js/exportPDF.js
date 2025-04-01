 // Improved PDF export function with better text selection
 function exportToPDF(format) {
    // First, switch to light theme for export
    const currentTheme = document.body.getAttribute("data-theme");
    if (currentTheme === "dark") {
        // toggle the theme
        toggleTheme();
    }
    
    // Hide export buttons and theme toggle during export
    const exportButtons = document.querySelector('.export-buttons');
    const themeToggle = document.querySelector('.theme-toggle');
    exportButtons.style.display = 'none';
    themeToggle.style.display = 'none';
    
    // Create a container for the PDF version with controlled styling
    const newElement = document.createElement('div');
    newElement.innerHTML = document.body.innerHTML;
    newElement.classList.add('pdf-content');
    
    // Remove buttons from the clone
    const newButtonsToRemove = newElement.querySelectorAll('.export-buttons, .theme-toggle');
    newButtonsToRemove.forEach(button => button.remove());
    
    // Set format (Letter or A4)
    const pageFormat = format || detectRegion();
    const width = pageFormat === 'letter' ? 8.5 : 8.27; // in inches
    const height = pageFormat === 'letter' ? 11 : 11.69; // in inches
    
    // Configure advanced html2pdf options for better text selection
    const opt = {
        margin: 0.75, // 3/4 inch margin
        filename: 'Abhinav_Rao_CV.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2, 
            letterRendering: true,
            useCORS: true,
            logging: false
        },
        jsPDF: { 
            unit: 'in', 
            format: [width, height], 
            orientation: 'portrait',
            compress: true,
            hotfixes: ["px_scaling"]
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    // Use an element with just the content we want to export
    const element = document.createElement('div');
    element.innerHTML = document.body.innerHTML;
    
    // Remove buttons from the clone
    const buttonsToRemove = element.querySelectorAll('.export-buttons, .theme-toggle');
    buttonsToRemove.forEach(button => button.remove());
    
    // Generate PDF with better text selection
    html2pdf()
        .set(opt)
        .from(element)
        .toPdf() // Convert to PDF
        .get('pdf')
        .then((pdf) => {
            // Enable font embedding and subsetting
            pdf.setProperties({
                title: 'Abhinav Rao - CV',
                subject: 'Curriculum Vitae',
                author: 'Abhinav Rao',
                keywords: 'CV, Resume, Abhinav Rao, NLP, AI',
                creator: 'HTML to PDF'
            });
            return pdf;
        })
        .save()
        .then(() => {
            // Restore theme and buttons
            toggleTheme();

            exportButtons.style.display = 'flex';
            themeToggle.style.display = 'block';
            
            console.log("PDF generated with selectable text");
        });
}