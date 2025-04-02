#!/bin/bash
pdflatex --output-directory=assets assets/Abhinav_Rao_CV.tex
rm assets/*.aux assets/*.log assets/*.out
sleep 1
git add .
git commit
git push origin master