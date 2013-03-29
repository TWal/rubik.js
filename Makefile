RENDERCOREFILES=src/libs/gl-matrix-min.js src/main.js src/Render/Buffer.js src/Render/Renderer.js src/Render/Mesh.js src/Render/RenderManager.js
RENDERCOREOUT=release/RubikjsRenderCore.js
RENDERCOREMINOUT=release/RubikjsRenderCore.min.js

WEBGLFILES=src/Render/WebGL/Buffer.js src/Render/WebGL/Renderer.js src/Render/WebGL/Shader.js
WEBGLOUT=release/RubikjsWebGL.js
WEBGLMINOUT=release/RubikjsWebGL.min.js

CANVASFILES=src/Render/Canvas/Renderer.js
CANVASOUT=release/RubikjsCanvas.js
CANVASMINOUT=release/RubikjsCanvas.min.js

SVGFILES=src/Render/SVG/Renderer.js
SVGOUT=release/RubikjsSVG.js
SVGMINOUT=release/RubikjsSVG.min.js

TWISTYFILES=src/Twisty/FixedPiecePlace.js src/Twisty/Generic.js
TWISTYOUT=release/RubikjsTwisty.js
TWISTYMINOUT=release/RubikjsTwisty.min.js

NOTATIONFILES=src/Notation/Instruction.js src/Notation/Move.js src/Notation/FullRotation.js src/Notation/Parser.js
NOTATIONOUT=release/RubikjsNotation.js
NOTATIONMINOUT=release/RubikjsNotation.min.js

.PHONY: simple min clean

all: simple

simple: $(RENDERCOREOUT) $(WEBGLOUT) $(CANVASOUT) $(SVGOUT) $(TWISTYOUT) $(NOTATIONOUT)

min: $(RENDERCOREMINOUT) $(WEBGLMINOUT) $(CANVASMINOUT) $(SVGMINOUT) $(TWISTYMINOUT) $(NOTATIONMINOUT)

clean:
	@rm release/*


$(RENDERCOREOUT): $(RENDERCOREFILES)
	@echo "Packing RenderCore files... "
	@cat $(RENDERCOREFILES) | grep -vE '^"use strict";$$' > $(RENDERCOREOUT)
	@echo -e '"use strict";\n' | cat - $(RENDERCOREOUT) > $(RENDERCOREOUT).tmp
	@mv $(RENDERCOREOUT).tmp $(RENDERCOREOUT)

$(WEBGLOUT): $(WEBGLFILES)
	@echo "Packing WebGL files... "
	@cat $(WEBGLFILES) | grep -vE '^"use strict";$$' > $(WEBGLOUT)
	@echo -e '"use strict";\n' | cat - $(WEBGLOUT) > $(WEBGLOUT).tmp
	@mv $(WEBGLOUT).tmp $(WEBGLOUT)

$(CANVASOUT): $(CANVASFILES)
	@echo "Packing Canvas files... "
	@cat $(CANVASFILES) | grep -vE '^"use strict";$$' > $(CANVASOUT)
	@echo -e '"use strict";\n' | cat - $(CANVASOUT) > $(CANVASOUT).tmp
	@mv $(CANVASOUT).tmp $(CANVASOUT)

$(SVGOUT): $(SVGFILES)
	@echo "Packing SVG files... "
	@cat $(SVGFILES) | grep -vE '^"use strict";$$' > $(SVGOUT)
	@echo -e '"use strict";\n' | cat - $(SVGOUT) > $(SVGOUT).tmp
	@mv $(SVGOUT).tmp $(SVGOUT)

$(TWISTYOUT): $(TWISTYFILES)
	@echo "Packing Twisty files... "
	@cat $(TWISTYFILES) | grep -vE '^"use strict";$$' > $(TWISTYOUT)
	@echo -e '"use strict";\n' | cat - $(TWISTYOUT) > $(TWISTYOUT).tmp
	@mv $(TWISTYOUT).tmp $(TWISTYOUT)

$(NOTATIONOUT): $(NOTATIONFILES)
	@echo "Packing Notation files... "
	@cat $(NOTATIONFILES) | grep -vE '^"use strict";$$' > $(NOTATIONOUT)
	@echo -e '"use strict";\n' | cat - $(NOTATIONOUT) > $(NOTATIONOUT).tmp
	@mv $(NOTATIONOUT).tmp $(NOTATIONOUT)


$(RENDERCOREMINOUT): $(RENDERCOREOUT)
	@echo "Minifying RenderCore files... "
	@java -jar closure/compiler.jar --js $(RENDERCOREOUT) --js_output_file $(RENDERCOREMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE and https://github.com/toji/gl-matrix/blob/master/LICENSE.md (glmatrix)\n" | cat - $(RENDERCOREMINOUT) > $(RENDERCOREMINOUT).tmp
	@mv $(RENDERCOREMINOUT).tmp $(RENDERCOREMINOUT)

$(WEBGLMINOUT): $(WEBGLOUT)
	@echo "Minifying WebGL files... "
	@java -jar closure/compiler.jar --js $(WEBGLOUT) --js_output_file $(WEBGLMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $(WEBGLMINOUT) > $(WEBGLMINOUT).tmp
	@mv $(WEBGLMINOUT).tmp $(WEBGLMINOUT)

$(CANVASMINOUT): $(CANVASOUT)
	@echo "Minifying Canvas files... "
	@java -jar closure/compiler.jar --js $(CANVASOUT) --js_output_file $(CANVASMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $(CANVASMINOUT) > $(CANVASMINOUT).tmp
	@mv $(CANVASMINOUT).tmp $(CANVASMINOUT)

$(SVGMINOUT): $(SVGOUT)
	@echo "Minifying SVG files... "
	@java -jar closure/compiler.jar --js $(SVGOUT) --js_output_file $(SVGMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $(SVGMINOUT) > $(SVGMINOUT).tmp
	@mv $(SVGMINOUT).tmp $(SVGMINOUT)

$(TWISTYMINOUT): $(TWISTYOUT)
	@echo "Minifying Twisty files... "
	@java -jar closure/compiler.jar --js $(TWISTYOUT) --js_output_file $(TWISTYMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $(TWISTYMINOUT) > $(TWISTYMINOUT).tmp
	@mv $(TWISTYMINOUT).tmp $(TWISTYMINOUT)

$(NOTATIONMINOUT): $(NOTATIONOUT)
	@echo "Minifying Notation files... "
	@java -jar closure/compiler.jar --js $(NOTATIONOUT) --js_output_file $(NOTATIONMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $(NOTATIONMINOUT) > $(NOTATIONMINOUT).tmp
	@mv $(NOTATIONMINOUT).tmp $(NOTATIONMINOUT)

