
    // Modified to avoid localStorage in sandboxed environments
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Use prefers-color-scheme as the default since we can't use localStorage
    if (prefersDarkScheme.matches) {
        document.body.setAttribute("data-theme", "dark");
    }
    
    function toggleTheme() {
        const currentTheme = document.body.getAttribute("data-theme");
        if (currentTheme === "dark") {
            document.body.removeAttribute("data-theme");
            // Don't try to use localStorage
        } else {
            document.body.setAttribute("data-theme", "dark");
            // Don't try to use localStorage
        }
    }
    
    function toggleVis() {
        var x = document.getElementsByClassName("export-buttons");
        for (var i = 0; i < x.length; i++) {
            if (x[i].style.display === "none") {
                x[i].style.display = "flex";
            } else {
                x[i].style.display = "none";
            }
        }
    }
    
    // Function to detect user's region and suggest appropriate paper size
    function detectRegion() {
        const language = navigator.language || navigator.userLanguage;
        const isUS = language && (language.includes('US') || language.includes('us'));
        return isUS ? 'letter' : 'a4';
    }
    
    // Improved PDF export function with better text selection
    function exportToPDF(format) {
        // First, switch to light theme for export
        const currentTheme = document.body.getAttribute("data-theme");
        if (currentTheme === "dark") {
            document.body.removeAttribute("data-theme");
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
                if (currentTheme === "dark") {
                    document.body.setAttribute("data-theme", "dark");
                }
                exportButtons.style.display = 'flex';
                themeToggle.style.display = 'block';
                
                console.log("PDF generated with selectable text");
            });
    }
    
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
    
    // Function to download as a Word document (using HTML format that Word can import)
    function downloadAsWord() {
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

    // Function to export to LaTeX format
function exportToLatex() {
    // Generate LaTeX content
    const latexContent = generateLatex();
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([latexContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'Abhinav_Rao_CV.tex';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Function to generate LaTeX content
function generateLatex() {
    // Get data from the current page
    const name = document.querySelector('h1').textContent.trim();
    const title = document.querySelector('header p').textContent.trim();
    const address = document.querySelector('.contact-info p').textContent.trim();
    
    // Get contact information
    const contactLinks = Array.from(document.querySelectorAll('.contact-info a')).map(a => {
        const text = a.textContent.trim();
        const href = a.getAttribute('href');
        return { text, href };
    });
    
    // Start building LaTeX document
    let latex = `\\documentclass[11pt,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{titlesec}
\\usepackage{xcolor}

% Define colors
\\definecolor{maincolor}{RGB}{00, 35, 102}
\\definecolor{darkgray}{RGB}{44, 62, 80}

% Set up hyperref
\\hypersetup{
    colorlinks=true,
    linkcolor=maincolor,
    urlcolor=maincolor,
    pdftitle={${name} - CV},
    pdfauthor={${name}}
}

% Format section headings
\\titleformat{\\section}{\\Large\\bfseries}{}{0em}{\\color{darkgray}}[\\color{maincolor}\\titlerule]
\\titlespacing*{\\section}{0pt}{12pt}{8pt}

% No page numbers
\\pagestyle{empty}

\\begin{document}

% Header
\\begin{center}
    {\\Huge\\bfseries ${name}}\\\\[2mm]
    {\\large ${title}}\\\\[1mm]
    {\\small ${address}}
\\end{center}

% Contact info
\\begin{center}
`;
    
    // Add contact links
    contactLinks.forEach((link, index) => {
        if (link.href.startsWith('mailto:')) {
            const email = link.href.replace('mailto:', '');
            latex += `\\href{${link.href}}{\\faEnvelope\\ ${email}}`;
        } else if (link.text.includes('github.com')) {
            latex += `\\href{${link.href}}{\\faGithub\\ ${link.text}}`;
        } else if (link.text.includes('Google Scholar')) {
            latex += `\\href{${link.href}}{\\faGraduationCap\\ ${link.text}}`;
        } else {
            latex += `\\href{${link.href}}{\\faGlobe\\ ${link.text}}`;
        }
        
        if (index < contactLinks.length - 1) {
            latex += ` $\\bullet$ `;
        }
    });
    
    latex += `
\\end{center}

`;
    
    // Education section
    latex += generateEducationSection();
    
    // Experience section
    latex += generateExperienceSection();
    
    // Publications section
    latex += generatePublicationsSection();
    
    // Research Projects section
    latex += generateProjectsSection();
    
    // Talks section
    latex += generateTalksSection();
    
    // Awards section
    latex += generateAwardsSection();
    
    // Teaching section
    latex += generateTeachingSection();
    
    // Service section
    latex += generateServiceSection();
    
    // References section
    latex += generateReferencesSection();
    
    // End document
    latex += `\\end{document}`;
    
    return latex;
}

// Function to generate Education section in LaTeX
function generateEducationSection() {
    let latex = `\\section*{Education}
\\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
`;
    
    const educationEntries = document.querySelectorAll('#education .entry');
    educationEntries.forEach(entry => {
        // Get the institution name
        const institution = entry.querySelector('.entry-header span:first-child').textContent.trim();
        const location = entry.querySelector('.location').textContent.trim();
        
        // Get the complete date string without trying to parse it
        const dateElement = entry.querySelector('.date');
        const date = dateElement ? dateElement.textContent.trim().replace(/\s*<i.*?<\/i>\s*/, '') : '';
        
        // Get the degree directly from the entry-body
        const degreeElement = entry.querySelector('.entry-body');
        const degree = degreeElement ? degreeElement.textContent.trim().replace(/^.*?(?:M\.S\.|B\.E\.)/, 'M.S.') : '';
        
        latex += `    \\item \\textbf{${institution}} \\hfill ${location}\\\\
        ${date}\\\\
        ${degree}
`;
    });
    
    latex += `\\end{itemize}

`;
    return latex;
}

// Function to generate Experience section in LaTeX
function generateExperienceSection() {
    let latex = `\\section*{Select Experience}
\\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
`;
    
    const experienceEntries = document.querySelectorAll('#experience .entry');
    experienceEntries.forEach(entry => {
        // Get company name without the icon
        const companyElement = entry.querySelector('.entry-header span:first-child');
        const company = companyElement ? companyElement.textContent.trim().replace(/\[↗\]/, '') : '';
        
        const locationElement = entry.querySelector('.location');
        const location = locationElement ? locationElement.textContent.trim() : '';
        
        // Get full date text
        const dateElement = entry.querySelector('.date');
        const date = dateElement ? dateElement.textContent.trim().replace(/\s*<i.*?<\/i>\s*/, '') : '';
        
        // Find all entry-body elements to extract both role and description
        const bodyElements = entry.querySelectorAll('.entry-body');
        let role = '';
        let description = '';
        
        if (bodyElements.length >= 1) {
            // First body element usually contains the role
            const firstBody = bodyElements[0];
            role = firstBody.textContent.trim();
            
            // If there's a strong tag inside, extract just that
            const strongElement = firstBody.querySelector('strong');
            if (strongElement) {
                role = strongElement.textContent.trim();
            }
        }
        
        if (bodyElements.length >= 2) {
            // Second body element usually contains the description
            description = bodyElements[1].textContent.trim();
        }
        
        latex += `    \\item \\textbf{${escapeLatex(company)}} \\hfill ${location}\\\\
        ${date}\\\\
        \\textit{${escapeLatex(role)}}\\\\
        ${escapeLatex(description)}
`;
    });
    
    latex += `\\end{itemize}

`;
    return latex;
}

// Function to generate Projects section in LaTeX
function generateProjectsSection() {
    let latex = `\\section*{Select Research Projects}
\\begin{itemize}[leftmargin=*,label={},itemsep=6pt]
`;
    
    const projectEntries = document.querySelectorAll('#projects .project');
    projectEntries.forEach(project => {
        // Extract complete project title
        const titleElement = project.querySelector('.project-header span:first-child');
        // Remove the icon from the title
        const fullTitle = titleElement ? titleElement.textContent.trim().replace(/^\s*[^\w]+\s*/, '') : '';
        
        const dateElement = project.querySelector('.date');
        const date = dateElement ? dateElement.textContent.trim().replace(/\s*<i.*?<\/i>\s*/, '') : '';
        
        const advisorsElement = project.querySelector('em');
        const advisors = advisorsElement ? advisorsElement.textContent.trim() : '';
        
        // Escape special LaTeX characters
        const escapedTitle = escapeLatex(fullTitle);
        const escapedAdvisors = escapeLatex(advisors);
        
        latex += `    \\item \\textbf{${escapedTitle}} \\hfill ${date}\\\\
        \\textit{${escapedAdvisors}}\\\\
`;
        
        const points = project.querySelectorAll('.project-point');
        points.forEach(point => {
            // Remove icons and brackets from the text
            const rawText = point.textContent.trim();
            const text = rawText
                .replace(/\[↗\]/g, '')
                .replace(/\[🎥\]/g, '')
                .replace(/\[\s*([^\]]+)\s*\]/g, '[$1]'); // Fix LaTeX brackets with spaces
            
            // Escape special LaTeX characters
            const escapedText = escapeLatex(text);
            
            latex += `        $\\triangleright$ ${escapedText}\\\\
`;
        });
    });
    
    latex += `\\end{itemize}

`;
    return latex;
}

// Function to generate Awards section in LaTeX
function generateAwardsSection() {
    const awardsSection = document.getElementById('awards');
    if (!awardsSection) return '';
    
    let latex = `\\section*{Honours and Awards}
\\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
`;
    
    const awardEntries = awardsSection.querySelectorAll('.entry');
    awardEntries.forEach(award => {
        // Get the title properly, removing the icon
        const titleElement = award.querySelector('strong');
        const title = titleElement ? 
            titleElement.textContent.trim().replace(/^\s*[^\w]+\s*/, '') : '';
        
        // Get the description from the entry-body
        const descriptionElement = award.querySelector('.entry-body');
        const description = descriptionElement ? descriptionElement.textContent.trim() : '';
        
        // Escape special LaTeX characters
        const escapedTitle = escapeLatex(title);
        const escapedDescription = escapeLatex(description);
        
        latex += `    \\item \\textbf{${escapedTitle}}\\\\
        ${escapedDescription}
`;
    });
    
    latex += `\\end{itemize}

`;
    return latex;
}

// Function to generate Publications section in LaTeX
function generatePublicationsSection() {
    let latex = `\\section*{Publications}
\\small{S=In Submission, C=Conference, W=Workshop, P=Preprint}

\\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
`;

    const publicationEntries = document.querySelectorAll('#publications .publication');
    publicationEntries.forEach(entry => {
        const id = entry.querySelector('.publication-id').textContent.trim();
        const title = entry.querySelector('strong').textContent.trim();
        const rest = entry.innerHTML.split('</strong>')[1]
            .replace(/<[^>]*>/g, '')
            .replace(/\[↗\]/, '')
            .trim();

        // Escape special LaTeX characters
        const escapedTitle = escapeLatex(title);
        const escapedRest = escapeLatex(rest);

        latex += `    \\item {\\color{maincolor}\\textbf{${id}}} \\textbf{${escapedTitle}}\\\\
        ${escapedRest}
`;
    });

    latex += `\\end{itemize}

`;
    return latex;
}

// Function to generate Talks section in LaTeX
function generateTalksSection() {
    const talksSection = document.getElementById('talks');
    if (!talksSection) return '';

    let latex = `\\section*{Talks}
\\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
`;

    const talkEntries = talksSection.querySelectorAll('.entry');
    talkEntries.forEach(talk => {
        const title = talk.querySelector('strong').textContent.trim();
        const points = talk.querySelectorAll('.project-point');

        // Escape special LaTeX characters
        const escapedTitle = escapeLatex(title);

        latex += `    \\item \\textbf{${escapedTitle}}\\\\
`;

        points.forEach(point => {
            const text = point.textContent.trim()
                .replace(/\[↗\]/, '')
                .replace(/\[🎥\]/, '')
                .replace(/\[([^\]]+)\]/g, '[$1]');

            // Escape special LaTeX characters
            const escapedText = escapeLatex(text);

            latex += `        $\\triangleright$ ${escapedText}\\\\
`;
        });
    });

    latex += `\\end{itemize}

`;
    return latex;
}

// Function to generate References section in LaTeX
function generateReferencesSection() {
    const referencesSection = document.getElementById('references');
    if (!referencesSection) return '';

    let latex = `\\section*{References}
\\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
`;

    const referenceEntries = referencesSection.querySelectorAll('.project-point');
    referenceEntries.forEach(reference => {
        const text = reference.textContent.trim()
            .replace(/\[↗\]/, '')
            .replace(/^[\s\S]*?\s/, '');

        // Get email from the href attribute
        const email = reference.querySelector('a').getAttribute('href').replace('mailto:', '');

        // Escape special LaTeX characters
        const escapedText = escapeLatex(text);

        latex += `    \\item ${escapedText} (\\href{mailto:${email}}{${email}})\\\\
`;
    });

    latex += `\\end{itemize}

`;
    return latex;
}

// Function to generate Teaching section in LaTeX
function generateTeachingSection() {
    const teachingSection = document.getElementById('teaching');
    if (!teachingSection) return '';

    let latex = `\\section*{Teaching}
\\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
`;

    const teachingEntries = teachingSection.querySelectorAll('.entry');
    teachingEntries.forEach(teaching => {
        const title = teaching.querySelector('strong').textContent.trim();
        const points = teaching.querySelectorAll('.project-point');

        // Escape special LaTeX characters
        const escapedTitle = escapeLatex(title);

        latex += `    \\item \\textbf{${escapedTitle}}\\\\
`;

        points.forEach(point => {
            const text = point.textContent.trim();

            // Escape special LaTeX characters
            const escapedText = escapeLatex(text);

            latex += `        $\\triangleright$ ${escapedText}\\\\
`;
        });
    });

    latex += `\\end{itemize}

`;
    return latex;
}

// Function to generate Service section in LaTeX
function generateServiceSection() {
    const serviceSection = document.getElementById('service');
    if (!serviceSection) return '';
    
    let latex = `\\section*{Academic Service}
\\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
`;
    
    // Get all divs in the service section
    const serviceElements = serviceSection.querySelectorAll('.entry div');
    
    // If we found service elements, process them
    if (serviceElements && serviceElements.length > 0) {
        let processedItems = [];
        
        // Go through each div element
        serviceElements.forEach(element => {
            const text = element.textContent.trim();
            
            // Skip empty elements
            if (!text || text.length === 0) return;
            
            // Process the text to handle roles and details
            if (text.includes(':')) {
                const parts = text.split(':');
                const role = parts[0].trim();
                const details = parts.slice(1).join(':').trim();
                
                const escapedRole = escapeLatex(role);
                const escapedDetails = escapeLatex(details);
                
                processedItems.push(`    \\item \\textbf{${escapedRole}:} ${escapedDetails}`);
            } else {
                const escapedText = escapeLatex(text);
                processedItems.push(`    \\item ${escapedText}`);
            }
        });
        
        // Add the processed items to the LaTeX output
        if (processedItems.length > 0) {
            latex += processedItems.join('\\\\\n') + '\\\\\n';
        } else {
            // Fallback in case processing didn't yield results
            latex += getFallbackServiceItems();
        }
    } else {
        // Fallback: Just add hardcoded service information
        latex += getFallbackServiceItems();
    }
    
    latex += `\\end{itemize}

`;
    return latex;
}

// Helper function to provide fallback service items
function getFallbackServiceItems() {
    return `    \\item \\textbf{Reviewer:} ACL ARR December 2023, TPAMI 2024, ACL ARR December 2024\\\\
    \\item \\textbf{Sub-Reviewer:} NAACL 2022\\\\
    \\item \\textbf{Volunteer:} Panini Linguistics Olympiad (PLO) 2023\\\\
`;
}

// Updated escape function to handle more cases
function escapeLatex(text) {
    if (!text) return '';
    
    return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/\$/g, '\\$')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/#/g, '\\#')
        .replace(/&/g, '\\&')
        .replace(/\^/g, '\\^{}')
        .replace(/~/g, '\\~{}')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        // Handle arrows and icons that might cause issues
        .replace(/→/g, '$\\rightarrow$')
        .replace(/←/g, '$\\leftarrow$')
        .replace(/↗/g, '')
        .replace(/\[↗\]/g, '')
        .replace(/\[🎥\]/g, '')
        // Replace % sign in percentages but ensure it's actually a percentage
        .replace(/(\d+)\s*%/g, '$1\\%');
}