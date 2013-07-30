COREFILES=src/main.js src/Core/Logger.js src/Core/Utils.js
COREOUT=release/RubikjsCore.js
COREMINOUT=release/RubikjsCore.min.js

RENDERFILES=src/libs/gl-matrix-min.js src/Render/Buffer.js src/Render/Renderer.js src/Render/Mesh.js src/Render/RenderManager.js src/Render/PieceFactory.js src/Render/StickerHelper.js
RENDEROUT=release/RubikjsRender.js
RENDERMINOUT=release/RubikjsRender.min.js

WEBGLFILES=src/Render/WebGL/Buffer.js src/Render/WebGL/Renderer.js src/Render/WebGL/Shader.js
WEBGLOUT=release/RubikjsRenderWebGL.js
WEBGLMINOUT=release/RubikjsRenderWebGL.min.js

CANVASFILES=src/Render/Canvas/Renderer.js
CANVASOUT=release/RubikjsRenderCanvas.js
CANVASMINOUT=release/RubikjsRenderCanvas.min.js

SVGFILES=src/Render/SVG/Renderer.js
SVGOUT=release/RubikjsRenderSVG.js
SVGMINOUT=release/RubikjsRenderSVG.min.js

TWISTYFILES=src/Twisty/FixedPiecePlace.js src/Twisty/Generic.js
TWISTYOUT=release/RubikjsTwisty.js
TWISTYMINOUT=release/RubikjsTwisty.min.js

NOTATIONFILES=src/Notation/Instruction.js src/Notation/Move.js src/Notation/MultiMove.js src/Notation/Parser.js
NOTATIONOUT=release/RubikjsNotation.js
NOTATIONMINOUT=release/RubikjsNotation.min.js

.PHONY: simple min clean

all: simple

simple: $(COREOUT) $(RENDEROUT) $(WEBGLOUT) $(CANVASOUT) $(SVGOUT) $(TWISTYOUT) $(NOTATIONOUT)

min: $(COREMINOUT) $(RENDERMINOUT) $(WEBGLMINOUT) $(CANVASMINOUT) $(SVGMINOUT) $(TWISTYMINOUT) $(NOTATIONMINOUT)
	@sed -re 's#release/(.+)\.js#release/\1.min.js#g' index.html > index.min.html

watch:
	@while true; do \
		inotifywait $(COREFILES) $(RENDERFILES) $(WEBGLFILES) $(CANVASFILES) $(SVGFILES) $(TWISTYFILES) $(NOTATIONFILES) > /dev/null 2>&1; \
		sleep 0.5; \
		make simple; \
	done

clean:
	@rm release/*


$(COREOUT): $(COREFILES)
	@echo "Packing Core files... "
	@cat $(COREFILES) | grep -vE '^"use strict";$$' > $(COREOUT)
	@echo -e '"use strict";\n' | cat - $(COREOUT) > $(COREOUT).tmp
	@mv $(COREOUT).tmp $(COREOUT)

$(RENDEROUT): $(RENDERFILES)
	@echo "Packing Render files... "
	@cat $(RENDERFILES) | grep -vE '^"use strict";$$' > $(RENDEROUT)
	@echo -e '"use strict";\n' | cat - $(RENDEROUT) > $(RENDEROUT).tmp
	@mv $(RENDEROUT).tmp $(RENDEROUT)

$(WEBGLOUT): $(WEBGLFILES)
	@echo "Packing RenderWebGL files... "
	@cat $(WEBGLFILES) | grep -vE '^"use strict";$$' > $(WEBGLOUT)
	@echo -e '"use strict";\n' | cat - $(WEBGLOUT) > $(WEBGLOUT).tmp
	@mv $(WEBGLOUT).tmp $(WEBGLOUT)

$(CANVASOUT): $(CANVASFILES)
	@echo "Packing RenderCanvas files... "
	@cat $(CANVASFILES) | grep -vE '^"use strict";$$' > $(CANVASOUT)
	@echo -e '"use strict";\n' | cat - $(CANVASOUT) > $(CANVASOUT).tmp
	@mv $(CANVASOUT).tmp $(CANVASOUT)

$(SVGOUT): $(SVGFILES)
	@echo "Packing RenderSVG files... "
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


$(COREMINOUT): $(COREOUT)
	@echo "Minifying Core files... "
	@java -jar closure/compiler.jar --js $(COREOUT) --js_output_file $(COREMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $(COREMINOUT) > $(COREMINOUT).tmp
	@mv $(COREMINOUT).tmp $(COREMINOUT)

$(RENDERMINOUT): $(RENDEROUT)
	@echo "Minifying Render files... "
	@java -jar closure/compiler.jar --js $(RENDEROUT) --js_output_file $(RENDERMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE and https://github.com/toji/gl-matrix/blob/master/LICENSE.md (glmatrix)\n" | cat - $(RENDERMINOUT) > $(RENDERMINOUT).tmp
	@mv $(RENDERMINOUT).tmp $(RENDERMINOUT)

$(WEBGLMINOUT): $(WEBGLOUT)
	@echo "Minifying RenderWebGL files... "
	@java -jar closure/compiler.jar --js $(WEBGLOUT) --js_output_file $(WEBGLMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $(WEBGLMINOUT) > $(WEBGLMINOUT).tmp
	@mv $(WEBGLMINOUT).tmp $(WEBGLMINOUT)

$(CANVASMINOUT): $(CANVASOUT)
	@echo "Minifying RenderCanvas files... "
	@java -jar closure/compiler.jar --js $(CANVASOUT) --js_output_file $(CANVASMINOUT) --compilation_level SIMPLE_OPTIMIZATIONS
	@echo -e "//License: https://github.com/TWal/rubik.js/blob/master/LICENSE\n" | cat - $(CANVASMINOUT) > $(CANVASMINOUT).tmp
	@mv $(CANVASMINOUT).tmp $(CANVASMINOUT)

$(SVGMINOUT): $(SVGOUT)
	@echo "Minifying RenderSVG files... "
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

