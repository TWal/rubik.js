"use strict";
Rubikjs.Renderer = function(element) {
	if(element) {
		this.perspectiveMat = mat4.create();
		mat4.perspective(70, element.offsetWidth/element.offsetHeight, 0.1, 100, this.perspectiveMat);
		//mat4.ortho(-2, 2, -2, 2, -10, 10, this.perspectiveMat);
		this.element = element;
	}
}

Rubikjs.Renderer.prototype.startFrame = function() {}
Rubikjs.Renderer.prototype.render = function(mesh) {}
Rubikjs.Renderer.prototype.endFrame = function() {}
Rubikjs.Renderer.prototype.createMesh = function() {
	return new Rubikjs.Mesh();
}



