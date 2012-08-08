#!/bin/bash
if [ ! -d "closure" ]; then
    mkdir closure
fi

wget http://closure-compiler.googlecode.com/files/compiler-latest.zip
yes | unzip -d closure compiler-latest.zip > /dev/null 2>&1
rm compiler-latest.zip

