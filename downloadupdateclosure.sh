#!/bin/bash
if [ ! -d "closure" ]; then
    mkdir closure
fi

wget http://closure-compiler.googlecode.com/files/compiler-latest.zip
unzip -d closure compiler-latest.zip
rm compiler-latest.zip

