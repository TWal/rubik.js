/*
Rubik.js

Copyright (c) 2012 Théophile Wallez

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

    1. The origin of this software must not be misrepresented; you must not
    claim that you wrote the original software. If you use this software
    in a product, an acknowledgment in the product documentation would be
    appreciated but is not required.

    2. Altered source versions must be plainly marked as such, and must not be
    misrepresented as being the original software.

    3. This notice may not be removed or altered from any source
    distribution.
*/

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


