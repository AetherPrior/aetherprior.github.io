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
Run the following command to export the cv to latex and push a commit:  
`$ push.sh`  
The pdf cv comes directly from the export to LaTeX option. The other options are available in the cv page.
