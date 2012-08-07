#!/bin/bash

core_path="release/RubikjsCore.js"
coremin_path="release/RubikjsCore.min.js"

webgl_path="release/RubikjsWebGL.js"
webglmin_path="release/RubikjsWebGL.min.js"

svg_path="release/RubikjsSVG.js"
svgmin_path="release/RubikjsSVG.min.js"

canvas_path="release/RubikjsCanvas.js"
canvasmin_path="release/RubikjsCanvas.min.js"

if [ "$1" == "--release" ]; then
    REL=1
elif [ -z "$1" ]; then
    REL=0
else
    echo "Usage: ./pack.sh or ./pack.sh --release"
    exit
fi

cat src/libs/gl-matrix-min.js src/main.js src/Render/Buffer.js src/Render/Renderer.js src/Render/Mesh.js src/Render/RenderManager.js | grep -vE '^"use strict";$' > $core_path
cat src/Render/WebGL/Buffer.js src/Render/WebGL/Renderer.js src/Render/WebGL/Shader.js | grep -vE '^"use strict";$' > $webgl_path
cat src/Render/Canvas/Renderer.js | grep -vE '^"use strict";$' > $canvas_path
cat src/Render/SVG/Renderer.js | grep -vE '^"use strict";$' > $svg_path

if [ $REL -eq 1 ]; then
    java -jar closure/compiler.jar --js $core_path --js_output_file $coremin_path --compilation_level SIMPLE_OPTIMIZATIONS
    java -jar closure/compiler.jar --js $webgl_path --js_output_file $webglmin_path --compilation_level SIMPLE_OPTIMIZATIONS
    java -jar closure/compiler.jar --js $canvas_path --js_output_file $canvasmin_path --compilation_level SIMPLE_OPTIMIZATIONS
    java -jar closure/compiler.jar --js $svg_path --js_output_file $svgmin_path --compilation_level SIMPLE_OPTIMIZATIONS
    echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE and https://github.com/toji/gl-matrix/blob/master/LICENSE.md (glmatrix)\n" | cat - $coremin_path > $coremin_path.tmp
    echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $webglmin_path > $webglmin_path.tmp
    echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $canvasmin_path > $canvasmin_path.tmp
    echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $svgmin_path > $svgmin_path.tmp
    mv $coremin_path.tmp $coremin_path
    mv $webglmin_path.tmp $webglmin_path
    mv $canvasmin_path.tmp $canvasmin_path
    mv $svgmin_path.tmp $svgmin_path
fi

echo -e '"use strict";\n' | cat - $core_path > $core_path.tmp
echo -e '"use strict";\n' | cat - $webgl_path > $webgl_path.tmp
echo -e '"use strict";\n' | cat - $canvas_path > $canvas_path.tmp
echo -e '"use strict";\n' | cat - $svg_path > $svg_path.tmp
mv $core_path.tmp $core_path
mv $webgl_path.tmp $webgl_path
mv $canvas_path.tmp $canvas_path
mv $svg_path.tmp $svg_path
