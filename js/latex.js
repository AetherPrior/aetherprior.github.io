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
    // Helper function to process HTML nodes and maintain formatting and links
    function processNodeForLatex(node) {
        if (!node) return '';
        
        // If it's a text node, just escape its content
        if (node.nodeType === Node.TEXT_NODE) {
            return escapeLatex(node.textContent);
        }
        
        // If it's an element node, process it according to its tag
        if (node.nodeType === Node.ELEMENT_NODE) {
            let content = '';
            
            // Process all child nodes first
            for (let child of node.childNodes) {
                content += processNodeForLatex(child);
            }
            
            // Apply appropriate formatting based on the tag
            if (node.tagName === 'STRONG' || node.tagName === 'B') {
                return `\\textbf{${content}}`;
            } else if (node.tagName === 'EM' || node.tagName === 'I') {
                return `\\textit{${content}}`;
            } else if (node.tagName === 'A') {
                const href = node.getAttribute('href');
                // Skip email links as we handle them separately
                if (href && !href.startsWith('mailto:')) {
                    // If it's a citation link (like [↗]), make it an inline link
                    if (node.textContent.trim() === '[↗]') {
                        return ` \\href{${href}}{[link]}`;
                    }
                    // For regular links
                    return `\\href{${href}}{${content}}`;
                }
            }
            
            // For other elements or if we've handled the formatting, just return the content
            return content;
        }
        
        // For any other node type, return empty string
        return '';
    }
    
    // Process an entire HTML element and convert it to LaTeX with formatting
    function processElementForLatex(element) {
        if (!element) return '';
        
        let result = '';
        for (let child of element.childNodes) {
            result += processNodeForLatex(child);
        }
        return result;
    }
    
    // Helper function to process text with citation links inline
    function processTextWithInlineLinks(element) {
        if (!element) return '';
        
        // Clone the element to avoid modifying the original
        const clone = element.cloneNode(true);
        
        // Find all citation links
        const links = clone.querySelectorAll('a');
        links.forEach(link => {
            if (link.textContent.trim() === '[↗]') {
                const href = link.getAttribute('href');
                // Replace with inline LaTeX href
                const span = document.createElement('span');
                span.setAttribute('data-latex', `\\href{${href}}{[link]}`);
                link.parentNode.replaceChild(span, link);
            }
        });
        
        // Now process the modified clone
        return processElementForLatex(clone);
    }
    
    // Function to generate Education section in LaTeX
    function generateEducationSection() {
        let latex = `\\section*{Education}
    \\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
    `;
        
        const educationEntries = document.querySelectorAll('#education .entry');
        educationEntries.forEach(entry => {
            // Get the institution name
            const institutionElement = entry.querySelector('.entry-header span:first-child');
            const institution = institutionElement ? processElementForLatex(institutionElement) : '';
            
            const locationElement = entry.querySelector('.location');
            const location = locationElement ? processElementForLatex(locationElement) : '';
            
            // Get the complete date string without trying to parse it
            const dateElement = entry.querySelector('.date');
            const date = dateElement ? dateElement.textContent.trim().replace(/\s*<i.*?<\/i>\s*/, '') : '';
            
            // Get the degree directly from the entry-body
            const degreeElement = entry.querySelector('.entry-body');
            const degree = degreeElement ? processElementForLatex(degreeElement) : '';
            
            latex += `    \\item \\textbf{${institution}} \\hfill ${location}\\\\
            ${date}\\\\
            ${degree}
    `;
        });
        
        latex += `\\end{itemize}
    
    `;
        return latex;
    }
    
    // Function to generate Experience section in LaTeX with proper links
    function generateExperienceSection() {
        let latex = `\\section*{Select Experience}
    \\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
    `;
        
        const experienceEntries = document.querySelectorAll('#experience .entry');
        experienceEntries.forEach(entry => {
            // Get company name without the icon
            const companyElement = entry.querySelector('.entry-header span:first-child');
            let company = '';
            
            if (companyElement) {
                // Clone to avoid modifying the original DOM
                const companyClone = companyElement.cloneNode(true);
                
                // Remove all links from the clone, we'll handle them separately
                const links = companyClone.querySelectorAll('a');
                links.forEach(link => {
                    if (link.textContent.trim() === '[↗]') {
                        const href = link.getAttribute('href');
                        link.remove();
                        company = processElementForLatex(companyClone);
                        // Add an inline link for the company
                        company += ` \\href{${href}}{[link]}`;
                    }
                });
                
                // If no links were processed, just process the whole element
                if (!company) {
                    company = processElementForLatex(companyElement);
                }
            }
            
            const locationElement = entry.querySelector('.location');
            const location = locationElement ? locationElement.textContent.trim() : '';
            
            // Get full date text
            const dateElement = entry.querySelector('.date');
            const date = dateElement ? 
                dateElement.textContent.trim().replace(/\s*<i.*?<\/i>\s*/, '') : '';
            
            // Find all entry-body elements to extract both role and description
            const bodyElements = entry.querySelectorAll('.entry-body');
            let role = '';
            let description = '';
            
            if (bodyElements.length >= 1) {
                // First body element usually contains the role
                role = processElementForLatex(bodyElements[0]);
            }
            
            if (bodyElements.length >= 2) {
                // Second body elements and so on usually contains the description
                // get all bodyelements after the first one
                const points = Array.from(bodyElements).slice(1);
                points.forEach(point => {
                    // Process the point to maintain formatting and links
                    const processedPoint = processElementForLatex(point);
                    description += `$\\triangleright$ ${processedPoint}\\\\`;
                });
            }
            
            latex += `    \\item \\textbf{${company}} \\hfill ${location}\\\\
            \\hfill ${date}\\\\
            ${role}\\\\
            ${description}
    `;
        });
        
        latex += `\\end{itemize}
    
    `;
        return latex;
    }
    
    // Function to generate Publications section in LaTeX with proper links
    function generatePublicationsSection() {
        let latex = `\\section*{Publications}
    \\small{S=In Submission, C=Conference, W=Workshop, P=Preprint}
    
    \\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
    `;
    
        const publicationEntries = document.querySelectorAll('#publications .publication');
        publicationEntries.forEach(entry => {
            // Get the publication ID
            const id = entry.querySelector('.publication-id').textContent.trim();
            
            // Get the title and its link if available
            const titleElement = entry.querySelector('strong');
            const titleLinkElement = titleElement.nextElementSibling;
            
            // Check if the next element is a link with [↗]
            let titleLink = '';
            if (titleLinkElement && titleLinkElement.tagName === 'A' && titleLinkElement.textContent.trim() === '[↗]') {
                const href = titleLinkElement.getAttribute('href');
                titleLink = ` \\href{${href}}{[link]}`;
            }
            
            // Process the title element to maintain its formatting
            const title = processElementForLatex(titleElement) + titleLink;
            
            // Create a clone of the entry to work with
            const entryClone = entry.cloneNode(true);
            
            // Remove the ID, title, and title link elements to get just the rest
            const idElement = entryClone.querySelector('.publication-id');
            const strongElement = entryClone.querySelector('strong');
            
            if (idElement) idElement.remove();
            if (strongElement) {
                // Also remove the citation link that follows the title
                const nextElement = strongElement.nextElementSibling;
                if (nextElement && nextElement.tagName === 'A' && nextElement.textContent.trim() === '[↗]') {
                    nextElement.remove();
                }
                strongElement.remove();
            }
            
            // Process the rest of the entry to maintain formatting and links
            const rest = processElementForLatex(entryClone);
    
            latex += `    \\item {\\color{maincolor}\\textbf{${id}}} \\textbf{${title}}  ${rest}
           
    `;
        });
    
        latex += `\\end{itemize}
    
    `;
        return latex;
    }
    
    
    // Function to generate Projects section in LaTeX with proper links
    function generateProjectsSection() {
        let latex = `\\section*{Select Research Projects}
    \\begin{itemize}[leftmargin=*,label={},itemsep=6pt]
    `;
        
        const projectEntries = document.querySelectorAll('#projects .project');
        projectEntries.forEach(project => {
            // Extract project title
            const titleElement = project.querySelector('.project-header span:first-child');
            // Remove the icon from the title
            const title = titleElement ? 
                titleElement.textContent.trim().replace(/^\s*[^\w]+\s*/, '') : '';
            
            const dateElement = project.querySelector('.date');
            const date = dateElement ? 
                dateElement.textContent.trim().replace(/\s*<i.*?<\/i>\s*/, '') : '';
            
            const advisorsElement = project.querySelector('em');
            const advisors = advisorsElement ? 
                processElementForLatex(advisorsElement) : '';
            
            // Escape special LaTeX characters
            const escapedTitle = escapeLatex(title);
            
            latex += `    \\item \\textbf{${escapedTitle}} \\hfill ${date}\\\\
            \\textit{${advisors}}\\\\
    `;
            
            const points = project.querySelectorAll('.project-point');
            points.forEach(point => {
                // Process the point to maintain formatting and links as inline citations
                const processedPoint = processElementForLatex(point);
                
                latex += `        $\\triangleright$ ${processedPoint}\\\\
    `;
            });
        });
        
        latex += `\\end{itemize}
    
    `;
        return latex;
    }
    
    // Function to generate Talks section in LaTeX with proper links
    function generateTalksSection() {
        const talksSection = document.getElementById('talks');
        if (!talksSection) return '';
    
        let latex = `\\section*{Talks}
    \\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
    `;
    
        const talkEntries = talksSection.querySelectorAll('.entry');
        talkEntries.forEach(talk => {
            const titleElement = talk.querySelector('strong');
            const title = titleElement ? processElementForLatex(titleElement) : '';
            
            const points = talk.querySelectorAll('.project-point');
    
            latex += `    \\item ${title}\\\\
    `;
    
            points.forEach(point => {
                // Process the point to maintain formatting and links
                const processedPoint = processElementForLatex(point);
                
                latex += `        $\\triangleright$ ${processedPoint}\\\\
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
            const title = titleElement ? processElementForLatex(titleElement) : '';
            
            // Get the description from the entry-body
            const descriptionElement = award.querySelector('.entry-body');
            const description = descriptionElement ? processElementForLatex(descriptionElement) : '';
            
            latex += `    \\item > \\textbf{${title}}\\\\
            ${description}
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
            const titleElement = teaching.querySelector('strong');
            const title = titleElement ? processElementForLatex(titleElement) : '';
            
            const points = teaching.querySelectorAll('.project-point');
    
            latex += `    \\item > \\textbf{${title}}\\\\
    `;
    
            points.forEach(point => {
                const processedPoint = processElementForLatex(point);
                latex += `        $\\triangleright$ ${processedPoint}\\\\
    `;
            });
        });
    
        latex += `\\end{itemize}
    
    `;
        return latex;
    }
    
    // Function to generate Academic Service section in LaTeX
    function generateServiceSection() {
        const serviceSection = document.getElementById('academic-service');
        if (!serviceSection) return '';
        
        let latex = `\\section*{Academic Service}
    \\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
    `;
        
        const serviceEntries = serviceSection.querySelectorAll('.entry div');
        if (serviceEntries && serviceEntries.length > 0) {
            serviceEntries.forEach(entry => {
                const processedEntry = processElementForLatex(entry);
                if (processedEntry.trim()) {
                    latex += `    \\item ${processedEntry}\\
    `;
                }
            });
        } else {
            // Fallback service information
            latex += `    \\item \\textbf{Reviewer:} ACL ARR December 2023, TPAMI 2024, ACL ARR December 2024\\\\
        \\item \\textbf{Sub-Reviewer:} NAACL 2022\\\\
        \\item \\textbf{Volunteer:} Panini Linguistics Olympiad (PLO) 2023\\\\
    `;
        }
        
        latex += `\\end{itemize}
    
    `;
        return latex;
    }
    
    // Function to generate References section in LaTeX with proper links
    function generateReferencesSection() {
        const referencesSection = document.getElementById('references');
        if (!referencesSection) return '';
    
        let latex = `\\section*{References}
    \\begin{itemize}[leftmargin=*,label={},itemsep=4pt]
    `;
    
        const referenceEntries = referencesSection.querySelectorAll('.project-point');
        referenceEntries.forEach(reference => {
            // Process each reference entry with formatting and links
            const emailLink = reference.querySelector('a[href^="mailto:"]');
            const email = emailLink ? emailLink.getAttribute('href').replace('mailto:', '') : '';
            
            // Create a clone to manipulate
            const cloneRef = reference.cloneNode(true);
            
            // Remove the email icon link if present
            const emailIconLink = cloneRef.querySelector('a[href^="mailto:"]');
            if (emailIconLink) emailIconLink.remove();
            
            // Process the rest of the reference with links
            const processedRef = processElementForLatex(cloneRef);
            
            latex += `    \\item ${processedRef} (\\href{mailto:${email}}{${email}})\\
    `;
        });
    
        latex += `\\end{itemize}
    
    `;
        return latex;
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
    
    // Complete generateLatex function with all sections
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
    \\usepackage{url}
    
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
            } else if (link.text.includes('Scholar')) {
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
        .replace(/\[🎥\]/g, '\[presentation\]')
        // Replace % sign in percentages but ensure it's actually a percentage
        .replace(/(\d+)\s*%/g, '$1\\%');
}
