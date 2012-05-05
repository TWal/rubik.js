#!/bin/sh
cat libs/gl-matrix-min.js main.js Buffer.js Renderer.js Mesh.js Cube.js | grep -v "^\"use strict\";" > packed/RubikjsCore.js
cat WebGL/Buffer.js WebGL/Renderer.js WebGL/Shader.js | grep -v "^\"use strict\";" > packed/RubikjsWebGL.js
cat Canvas/Renderer.js | grep -v "^\"use strict\";" > packed/RubikjsCanvas.js
cat SVG/Renderer.js | grep -v "^\"use strict\";" > packed/RubikjsSVG.js

#TODO: Put into the Closure packer
