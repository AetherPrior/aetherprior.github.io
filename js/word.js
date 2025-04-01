    // Function to download as a Word document (using HTML format that Word can import)
    function exportToWord() {
        // Clone body content
        const content = document.documentElement.outerHTML;
        
        // Create a Blob with the HTML content
        const blob = new Blob([content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        
        // Create a link element and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Abhinav_Rao_CV.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    }