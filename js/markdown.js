/**
 * Function to export CV to Markdown format
 */
function exportToMarkdown() {
    // Generate Markdown content
    const markdownContent = generateMarkdown();
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([markdownContent], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = 'Abhinav_Rao_CV.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Generate the full Markdown document for the CV
 */
function generateMarkdown() {
    // Get basic info
    const name = document.querySelector('h1').textContent.trim();
    const title = document.querySelector('header p').textContent.trim();
    const address = document.querySelector('.contact-info p').textContent.trim();
    
    // Start building markdown content
    let markdown = `# ${name}\n\n`;
    markdown += `${title}\n\n`;
    markdown += `${address}\n\n`;
    
    // Add contact information
    markdown += "## Contact\n\n";
    const contactLinks = document.querySelectorAll('.contact-info a');
    contactLinks.forEach(link => {
        const text = link.textContent.trim();
        const href = link.getAttribute('href');
        
        if (href.startsWith('mailto:')) {
            const email = href.replace('mailto:', '');
            markdown += `- 📧 Email: [${email}](${href})\n`;
        } else if (text.includes('github.com')) {
            markdown += `- 💻 GitHub: [${text}](${href})\n`;
        } else if (text.includes('Scholar')) {
            markdown += `- 🎓 ${text}: [Google Scholar](${href})\n`;
        } else {
            markdown += `- 🔗 Website: [${text}](${href})\n`;
        }
    });
    markdown += "\n";
    
    // Add all sections
    markdown += generateEducationMarkdown();
    markdown += generateExperienceMarkdown();
    markdown += generatePublicationsMarkdown();
    markdown += generateProjectsMarkdown();
    markdown += generateTalksMarkdown();
    markdown += generateAwardsMarkdown();
    markdown += generateTeachingMarkdown();
    markdown += generateServiceMarkdown();
    markdown += generateReferencesMarkdown();
    
    // Add footer
    const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    markdown += `\n\n---\n\n*${date} | ${name}*\n`;
    
    return markdown;
}

/**
 * Convert HTML content to Markdown format
 * This handles basic formatting like bold and links
 */
function htmlToMarkdown(element) {
    if (!element) return '';
    
    // If it's a string, return it directly
    if (typeof element === 'string') return element;
    
    // If it's a text node, return its content
    if (element.nodeType === Node.TEXT_NODE) return element.textContent;
    
    // Handle specific element types
    if (element.nodeType === Node.ELEMENT_NODE) {
        // Start with an empty result
        let result = '';
        
        // If it's a wrapper element, process its children
        if (element.tagName === 'DIV' || element.tagName === 'SPAN' || element.tagName === 'P') {
            for (const child of element.childNodes) {
                result += htmlToMarkdown(child);
            }
            return result;
        }
        
        // Handle specific formatting elements
        if (element.tagName === 'STRONG' || element.tagName === 'B') {
            // Process children and wrap in **bold**
            let content = '';
            for (const child of element.childNodes) {
                content += htmlToMarkdown(child);
            }
            return `**${content}**`;
        }
        
        if (element.tagName === 'EM' || element.tagName === 'I') {
            // Process children and wrap in *italic*
            let content = '';
            for (const child of element.childNodes) {
                content += htmlToMarkdown(child);
            }
            return `*${content}*`;
        }
        
        if (element.tagName === 'A') {
            // Handle links - [text](url)
            const href = element.getAttribute('href');
            let content = '';
            for (const child of element.childNodes) {
                content += htmlToMarkdown(child);
            }
            
            // If it's a citation link [↗], add it as a link marker
            if (content.trim() === '[↗]') {
                return ` [🔗](${href})`;
            }
            
            // Otherwise, make it a normal Markdown link
            return `[${content}](${href})`;
        }
        
        // For any other element, just process its children
        for (const child of element.childNodes) {
            result += htmlToMarkdown(child);
        }
        return result;
    }
    
    // For any other node type, return empty string
    return '';
}

/**
 * Process an entire HTML element to Markdown
 */
function processElementToMarkdown(element) {
    if (!element) return '';
    
    return htmlToMarkdown(element);
}

/**
 * Generate Education section in Markdown
 */
function generateEducationMarkdown() {
    let markdown = "## Education\n\n";
    
    const educationEntries = document.querySelectorAll('#education .entry');
    educationEntries.forEach(entry => {
        // Get the institution name
        const institution = entry.querySelector('.entry-header span:first-child').textContent.trim();
        const location = entry.querySelector('.location').textContent.trim();
        const date = entry.querySelector('.date').textContent.trim();
        
        // Get the degree from entry-body
        const degreeElement = entry.querySelector('.entry-body');
        const degree = processElementToMarkdown(degreeElement);
        
        markdown += `### ${institution} | ${location}\n`;
        markdown += `*${date}*\n\n`;
        markdown += `${degree}\n\n`;
    });
    
    return markdown;
}

/**
 * Generate Experience section in Markdown
 */
function generateExperienceMarkdown() {
    let markdown = "## Experience\n\n";
    
    const experienceEntries = document.querySelectorAll('#experience .entry');
    experienceEntries.forEach(entry => {
        // Get company name and process any links
        const companyElement = entry.querySelector('.entry-header span:first-child');
        const company = processElementToMarkdown(companyElement);
        
        const location = entry.querySelector('.location').textContent.trim();
        const date = entry.querySelector('.date').textContent.trim();
        
        // Process roles and description
        const bodyElements = entry.querySelectorAll('.entry-body');
        let role = '';
        let description = '';
        
        if (bodyElements.length >= 1) {
            role = processElementToMarkdown(bodyElements[0]);
        }
        
        if (bodyElements.length >= 2) {
            // Get all body elements after the first one for description
            const descriptions = Array.from(bodyElements).slice(1);
            descriptions.forEach(desc => {
                const processedDesc = processElementToMarkdown(desc);
                description += `- ${processedDesc}\n`;
            });
        }
        
        markdown += `### ${company} | ${location}\n`;
        markdown += `*${date}*\n\n`;
        markdown += `${role}\n\n`;
        if (description) markdown += `${description}\n`;
    });
    
    return markdown;
}

/**
 * Generate Publications section in Markdown
 */
function generatePublicationsMarkdown() {
    let markdown = "## Publications\n\n";
    markdown += "*S=In Submission, C=Conference, W=Workshop, P=Preprint*\n\n";
    
    const publicationEntries = document.querySelectorAll('#publications .publication');
    publicationEntries.forEach(entry => {
        const id = entry.querySelector('.publication-id').textContent.trim();
        
        // Process entire publication content
        const content = processElementToMarkdown(entry);
        
        // Remove the ID from the processed content since we'll format it separately
        const contentWithoutId = content.replace(id, '').trim();
        
        markdown += `- **${id}** ${contentWithoutId}\n`;
    });
    
    markdown += "\n";
    return markdown;
}

/**
 * Generate Projects section in Markdown
 */
function generateProjectsMarkdown() {
    let markdown = "## Research Projects\n\n";
    
    const projectEntries = document.querySelectorAll('#projects .project');
    projectEntries.forEach(project => {
        // Extract project title
        const titleElement = project.querySelector('.project-header span:first-child');
        // Remove the icon from the title
        const title = titleElement.textContent.trim().replace(/^\s*[^\w]+\s*/, '');
        
        const dateElement = project.querySelector('.date');
        const date = dateElement ? dateElement.textContent.trim() : '';
        
        const advisorsElement = project.querySelector('em');
        const advisors = advisorsElement ? processElementToMarkdown(advisorsElement) : '';
        
        markdown += `### ${title} | ${date}\n`;
        markdown += `*${advisors}*\n\n`;
        
        const points = project.querySelectorAll('.project-point');
        points.forEach(point => {
            const processedPoint = processElementToMarkdown(point);
            markdown += `- ${processedPoint}\n`;
        });
        
        markdown += "\n";
    });
    
    return markdown;
}

/**
 * Generate Talks section in Markdown
 */
function generateTalksMarkdown() {
    const talksSection = document.getElementById('talks');
    if (!talksSection) return '';
    
    let markdown = "## Talks\n\n";
    
    const talkEntries = talksSection.querySelectorAll('.entry');
    talkEntries.forEach(talk => {
        const titleElement = talk.querySelector('strong');
        const title = processElementToMarkdown(titleElement);
        
        markdown += `### ${title}\n\n`;
        
        const points = talk.querySelectorAll('.project-point');
        points.forEach(point => {
            const processedPoint = processElementToMarkdown(point);
            markdown += `- ${processedPoint}\n`;
        });
        
        markdown += "\n";
    });
    
    return markdown;
}

/**
 * Generate Awards section in Markdown
 */
function generateAwardsMarkdown() {
    const awardsSection = document.getElementById('awards');
    if (!awardsSection) return '';
    
    let markdown = "## Honors and Awards\n\n";
    
    const awardEntries = awardsSection.querySelectorAll('.entry');
    awardEntries.forEach(award => {
        const titleElement = award.querySelector('strong');
        const title = processElementToMarkdown(titleElement);
        
        const descriptionElement = award.querySelector('.entry-body');
        const description = processElementToMarkdown(descriptionElement);
        
        markdown += `### ${title}\n`;
        markdown += `${description}\n\n`;
    });
    
    return markdown;
}

/**
 * Generate Teaching section in Markdown
 */
function generateTeachingMarkdown() {
    const teachingSection = document.getElementById('teaching');
    if (!teachingSection) return '';
    
    let markdown = "## Teaching\n\n";
    
    const teachingEntries = teachingSection.querySelectorAll('.entry');
    teachingEntries.forEach(teaching => {
        const titleElement = teaching.querySelector('strong');
        const title = processElementToMarkdown(titleElement);
        
        markdown += `### ${title}\n\n`;
        
        const points = teaching.querySelectorAll('.project-point');
        points.forEach(point => {
            const processedPoint = processElementToMarkdown(point);
            markdown += `- ${processedPoint}\n`;
        });
        
        markdown += "\n";
    });
    
    return markdown;
}

/**
 * Generate Academic Service section in Markdown
 */
function generateServiceMarkdown() {
    const serviceSection = document.getElementById('academic-service');
    if (!serviceSection) return '';
    
    let markdown = "## Academic Service\n\n";
    
    const serviceEntries = serviceSection.querySelectorAll('.entry div');
    if (serviceEntries && serviceEntries.length > 0) {
        serviceEntries.forEach(entry => {
            const processedEntry = processElementToMarkdown(entry);
            if (processedEntry.trim()) {
                markdown += `- ${processedEntry}\n`;
            }
        });
    } else {
        // Fallback service information
        markdown += "- **Reviewer**: ACL ARR December 2023, TPAMI 2024, ACL ARR December 2024\n";
        markdown += "- **Sub-Reviewer**: NAACL 2022\n";
        markdown += "- **Volunteer**: Panini Linguistics Olympiad (PLO) 2023\n";
    }
    
    markdown += "\n";
    return markdown;
}

/**
 * Generate References section in Markdown
 */
function generateReferencesMarkdown() {
    const referencesSection = document.getElementById('references');
    if (!referencesSection) return '';
    
    let markdown = "## References\n\n";
    
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
        const processedRef = processElementToMarkdown(cloneRef);
        
        markdown += `- ${processedRef} (${email})\n`;
    });
    
    markdown += "\n";
    return markdown;
}