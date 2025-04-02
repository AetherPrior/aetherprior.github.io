const fs = require('fs');
const { JSDOM } = require('jsdom');
// import all functions from js/latex.js
const { generateLatex } = require('./js/latex');

// Create a virtual DOM environment
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;
global.Element = dom.window.Element;

// Load the CV HTML content
const htmlContent = fs.readFileSync('cv.html', 'utf8');
const cvDom = new JSDOM(htmlContent);
document.body.innerHTML = cvDom.window.document.body.innerHTML;


// Generate and save the LaTeX file
try {
    console.log(generateLatex);
    const latexContent = generateLatex();
    fs.writeFileSync('./assets/Abhinav_Rao_CV.tex', latexContent);
    console.log('Successfully generated LaTeX file: Abhinav_Rao_CV.tex');
}
catch (error) {
    console.error('Error generating LaTeX:', error);
}