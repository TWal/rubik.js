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

Rubikjs.Render.PieceFactory = function(pieceConstructor, baseMesh, namedColorBuffer, defaultColors) {
    this.pieceConstructor = pieceConstructor;
    this.baseMesh = baseMesh;
    this.namedColorBuffer = namedColorBuffer;
    this.defaultColors = defaultColors;
};

Rubikjs.Render.PieceFactory.prototype.create = function(translation, angle, colors) {
    var newColors = Rubikjs.Core.Utils.makeOptions(this.defaultColors, colors);

    var colorBufferData = this.namedColorBuffer.map(function(color) {
        return newColors[color];
    }).reduce(function(a, b) {
        return a.concat(b);
    }, []);

    var mesh = this.baseMesh.copy();
    mesh.colorBuffer.feed(colorBufferData);

    mat4.translate(mesh.transform, mesh.transform, translation);
    mat4.rotateX(mesh.transform, mesh.transform, angle[0]);
    mat4.rotateY(mesh.transform, mesh.transform, angle[1]);
    mat4.rotateZ(mesh.transform, mesh.transform, angle[2]);

    return new this.pieceConstructor(mesh);
};
