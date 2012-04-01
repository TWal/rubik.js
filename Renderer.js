Rubikjs.Renderer = function(element) {
	this.perspectiveMat;
	this.modelViewMat;
	this.renderElement;
	this.element = element;
}

Rubikjs.Renderer.prototype.startFrame = function() {}
Rubikjs.Renderer.prototype.render = function(mesh) {}
Rubikjs.Renderer.prototype.endFrame = function() {}



