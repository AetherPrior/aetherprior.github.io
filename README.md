# aetherprior.github.io

[![Netlify Status](https://api.netlify.com/api/v1/badges/69cb770b-e446-4a54-a601-c631b111557c/deploy-status)](https://app.netlify.com/projects/abhinavrao/deploys)
![Github Pages status](https://github.com/AetherPrior/aetherprior.github.io/actions/workflows/deploy.yml/badge.svg)

- This is the repository for my personal website. Borrowed from [The Best Motherfucking Website](https://thebestmotherfucking.website/). 
- The website is hosted at [aetherprior.github.io](https://aetherprior.github.io/). A mirror is available at [abhinavrao.netlify.app](https://abhinavrao.netlify.app/).  
- The website runs on pure HTML, CSS, JS. Deployed on Netlify and Github Pages. Nothing else.
- The website is Licensed under the [MIT License](LICENSE.txt).

# Extremely basic
- The website is extremely basic. It has a cv page.
- The website is designed to be extremely fast and lightweight. It is designed to be a simple static website that loads quickly and is easy to navigate.
- The website does everything natively. 
- The website supports exporting a cv to latex.

# Setup 
You can clone the repository and run the website locally (arch linux only):  
`$ setup.sh`  
For other systems, you need to install TexLive, nvm, node and npm. And JSDom, Canvas as node packages.  

# Export CV to LaTeX
The web CV in `web_cv.html` is the source for both the browser's **LaTeX Source** button and the command-line exporter.

```sh
npm ci
npm test
npm run export:cv
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=assets assets/Abhinav_Rao_CV.tex
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=assets assets/Abhinav_Rao_CV.tex
```

Use a TeX Live installation with `lmodern`, `geometry`, `hyperref`, `enumitem`, `fontawesome5`, `titlesec`, and `xcolor`. Minimal TeX installations may need additional packages. Two compilation passes resolve PDF links and outlines. The resulting `assets/Abhinav_Rao_CV.pdf` is served by the **PDF Version** button.

To export to a different location, run `node export_to_latex.js /path/to/cv.tex`. The tests check browser/CLI parity, character escaping, and complete CV entries without duplicates.

`push.sh` also commits and pushes changes; use the commands above for local verification only.
