"use strict";
//Define namespaces

(function(_global) {
	_global.Rubikjs = {};
	_global.Rubikjs.SVG = {};
	_global.Rubikjs.Canvas = {};
	_global.Rubikjs.WebGL = {};
})((typeof(exports) != 'undefined') ? global : this); //Taken from glMatrix

Rubikjs.init = function(root) {
	root = root || "";
	var files = [
		"libs/gl-matrix-min.js",
		"Buffer.js",
		"Renderer.js",
		"Mesh.js",
		"Cube.js",
		"Canvas/Renderer.js",
		"SVG/Renderer.js",
		"WebGL/Buffer.js",
		"WebGL/Renderer.js",
		"WebGL/Shader.js"
	];
	for(var i = 0; i < files.length; ++i) {
		var script = document.createElement("script");
		script["type"] = "text/javascript";
		script["src"] = root + files[i];
		document.getElementsByTagName("head")[0].appendChild(script);
	}
}

