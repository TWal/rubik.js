Rubikjs.Cube = function() {
	var meshs = [];
	var definition;
	var renderer;
}

Rubikjs.Cube.prototype.render = function() {
	meshs.each(function(mesh) {
		renderer.render(mesh);
	});
}

