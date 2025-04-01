#!/bin/bash
pdflatex --output-directory=assets assets/Abhinav_Rao_CV.tex
rm assets/*.aux assets/*.log assets/*.out
git add .
git commit
git push origin master