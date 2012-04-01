Rubikjs.WebGL.Renderer = function() {
	this.gl;
	try {
		this.gl = canvas.getContext("experimental-wegl");
		if(!this.gl) {
			this.gl = canvas.getContext("webgl");
		}
		if(!this.gl) {
			alert("No WebGL :(");
		}
	} catch(e) {}
}

Rubikjs.WebGL.Renderer.prototype = new Rubikjs.Renderer();
Rubikjs.WebGL.Renderer.prototype.constructor = Rubikjs.WebGL.Renderer;

Rubikjs.Renderer.prototype.startFrame = function() {
	this.gl.clearColor(0, 0, 0, 0);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
}
Rubikjs.WebGL.Renderer.prototype.render = function(mesh) {
	//TODO: Render in WebGL
}
Rubikjs.Renderer.prototype.endFrame = function() {}

