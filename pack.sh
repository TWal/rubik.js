#!/bin/bash

core_path="release/RubikjsCore.js"
coremin_path="release/RubikjsCore.min.js"

webgl_path="release/RubikjsWebGL.js"
webglmin_path="release/RubikjsWebGL.min.js"

svg_path="release/RubikjsSVG.js"
svgmin_path="release/RubikjsSVG.min.js"

canvas_path="release/RubikjsCanvas.js"
canvasmin_path="release/RubikjsCanvas.min.js"

if [ "$1" == "--development" ]; then
	DEV=1
	REL=0
elif [ "$1" == "--release" ]; then
	DEV=0
	REL=1
else
	echo "Usage: ./pack.sh --development or ./pack.sh --release"
	exit
fi


cat src/libs/gl-matrix-min.js src/main.js src/Buffer.js src/Renderer.js src/Mesh.js src/Cube.js | grep -v '^"use strict";$' > $core_path
cat src/WebGL/Buffer.js src/WebGL/Renderer.js src/WebGL/Shader.js | grep -v '^"use strict";$' > $webgl_path
cat src/Canvas/Renderer.js | grep -v '^"use strict";$' > $canvas_path
cat src/SVG/Renderer.js | grep -v '^"use strict";$' > $svg_path

if [ $DEV -eq 1 ]; then
	echo -e '"use strict";\n' | cat - $core_path > $core_path.tmp
	echo -e '"use strict";\n' | cat - $webgl_path > $webgl_path.tmp
	echo -e '"use strict";\n' | cat - $canvas_path > $canvas_path.tmp
	echo -e '"use strict";\n' | cat - $svg_path > $svg_path.tmp
	mv $core_path.tmp $core_path
	mv $webgl_path.tmp $webgl_path
	mv $canvas_path.tmp $canvas_path
	mv $svg_path.tmp $svg_path
fi
if [ $REL -eq 1 ]; then
	java -jar closure/compiler.jar --js $core_path --js_output_file $coremin_path --compilation_level SIMPLE_OPTIMIZATIONS
	java -jar closure/compiler.jar --js $webgl_path --js_output_file $webglmin_path --compilation_level SIMPLE_OPTIMIZATIONS
	java -jar closure/compiler.jar --js $canvas_path --js_output_file $canvasmin_path --compilation_level SIMPLE_OPTIMIZATIONS
	java -jar closure/compiler.jar --js $svg_path --js_output_file $svgmin_path --compilation_level SIMPLE_OPTIMIZATIONS
fi

