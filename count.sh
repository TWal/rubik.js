#!/bin/bash

#Taken from here: http://www.tty1.net/sed-intro_en.html#-k-comments
sedscript='/^[[:blank:]]*\/\/.*/d
s/\/\/.*//
: test
/\/\*/!b
: append
/\*\//!{N;b append;}
s/\/\*\([^\*]\|\*[^k]\)*\*\?\*\///g
t test'

fullCode=`find . -name *.js | grep -vE "^./release/" | grep -vE "^./src/libs/" | xargs cat`
lineNumber=`printf "%s" "$fullCode" | wc -l`
lineNumberOnlyUseful=`printf "%s" "$fullCode" | sed -e "$sedscript" | sed "/^\s*$/d" | wc -l`

charNumber=`printf "%s" "$fullCode" | wc -m`
charNumberOnlyUseful=`printf "%s" "$fullCode" | sed -e "$sedscript" | sed "/^\s*$/d" | sed "s/^\s*//g" | sed "s/\s*$//g" | sed -r "s/\s+/ /g" | wc -m`

echo "Line number: $lineNumber"
echo "Line number without comments: $lineNumberOnlyUseful"
echo "Character number: $charNumber"
echo "Character number without comment and blank characters: $charNumberOnlyUseful"
