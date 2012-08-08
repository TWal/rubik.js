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

lineNumber=`find src -type f | grep -vE "^src/libs/.*$" | xargs cat | wc -l`
lineNumberOnlyUseful=`find src -type f | grep -vE "^src/libs/.*$" | xargs cat | sed -e "$sedscript" | sed "/^\s*$/d" | wc -l`

charNumber=`find src -type f | grep -vE "^src/libs/.*$" | xargs cat | wc -m`
charNumberOnlyUseful=`find src -type f | grep -vE "^src/libs/.*$" | xargs cat | sed -e "$sedscript" | sed "/^\s*$/d" | sed "s/^\s*//g" | sed "s/\s*$//g" | sed -r "s/\s+/ /g" | wc -m`

echo "Line number: $lineNumber"
echo "Line number without comments: $lineNumberOnlyUseful"
echo "Character number: $charNumber"
echo "Character number without comment and blank characters: $charNumberOnlyUseful"
