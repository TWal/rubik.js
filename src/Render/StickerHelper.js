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

Rubikjs.Render.StickerHelper = function(generator) {
    this.generator = generator;
};

Rubikjs.Render.StickerHelper.prototype.create = function(mesh, margin, distance, flip) {
    flip = flip || false;
    var result = this.generator(margin, distance);
    if(result.index) {
        if(flip) {
            for(var i = 0; i < result.index.length; i+=3) {
                var tmp = result.index[i+1];
                result.index[i+1] = result.index[i+2];
                result.index[i+2] = tmp;
            }
        }
        mesh.indexBuffer.feed(mesh.indexBuffer.data.concat(result.index.map(function(d) {
            return d + mesh.vertexBuffer.data.length/3;
        })));
    }

    if(result.vertex) {
        mesh.vertexBuffer.feed(mesh.vertexBuffer.data.concat(result.vertex));
    }

    if(result.color) {
        mesh.colorBuffer.feed(mesh.colorBuffer.data.concat(result.color));
    }

    if(result.other) {
        for(var key in result.other) {
            mesh[key] = mesh[key].concat(result.other[key]);
        }
    }
};
