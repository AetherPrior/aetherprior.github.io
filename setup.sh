#!/bin/bash
sudo pacman -S texlive-basic texlive-bin texlive-core texlive-latexextra texlive-fontsextra texlive-bibtexextra texlive-formatsextra 
sudo pacman -S nvm
nvm install node
npm init -y
npm install jsdom canvas