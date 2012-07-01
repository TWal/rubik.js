"use strict";
Rubikjs.WebGL.Buffer = function(gl, data, type) {
	this.gl = gl;
	this.type = type || this.gl.ARRAY_BUFFER;
	this.buffer = this.gl.createBuffer();
	if(data != undefined && data.length != 0) {
		this.feed(data);
	}
}

Rubikjs.WebGL.Buffer.prototype = new Rubikjs.Buffer;
Rubikjs.WebGL.Buffer.prototype.constructor = Rubikjs.WebGL.Buffer;

Rubikjs.WebGL.Buffer.prototype.feed = function(data) {
	this.data = data;
	this.bind();
	var arrayType = this.type == this.gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
	this.gl.bufferData(this.type, new arrayType(this.data), this.gl.STATIC_DRAW);
}

Rubikjs.WebGL.Buffer.prototype.bind = function() {
	//Don't re-bind a buffer that is already bounded, because it is a really expansive operation
	if(this.gl.boundBuffer != this.buffer) {
		//console.log("Bound")
		this.gl.bindBuffer(this.type, this.buffer);
		this.gl.boundBuffer = this.buffer;
	} else {
		//console.log("Rebound");
	}
}


