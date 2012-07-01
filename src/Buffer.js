"use strict";
Rubikjs.Buffer = function(data) {
	if(data) {
		this.data = data;
	}
}

Rubikjs.Buffer.prototype.feed = function(data) {
	this.data = data;
}

