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


//                                                 dddddddd                 
//TTTTTTTTTTTTTTTTTTTTTTT                          d::::::d                 
//T:::::::::::::::::::::T                          d::::::d                 
//T:::::::::::::::::::::T                          d::::::d  <-- Wow, what a big todo               
//T:::::TT:::::::TT:::::T                          d:::::d                  
//TTTTTT  T:::::T  TTTTTTooooooooooo       ddddddddd:::::d    ooooooooooo   
//        T:::::T      oo:::::::::::oo   dd::::::::::::::d  oo:::::::::::oo 
//        T:::::T     o:::::::::::::::o d::::::::::::::::d o:::::::::::::::o
//        T:::::T     o:::::ooooo:::::od:::::::ddddd:::::d o:::::ooooo:::::o
//        T:::::T     o::::o     o::::od::::::d    d:::::d o::::o     o::::o
//        T:::::T     o::::o     o::::od:::::d     d:::::d o::::o     o::::o
//        T:::::T     o::::o     o::::od:::::d     d:::::d o::::o     o::::o
//        T:::::T     o::::o     o::::od:::::d     d:::::d o::::o     o::::o
//      TT:::::::TT   o:::::ooooo:::::od::::::ddddd::::::ddo:::::ooooo:::::o
//      T:::::::::T   o:::::::::::::::o d:::::::::::::::::do:::::::::::::::o
//      T:::::::::T    oo:::::::::::oo   d:::::::::ddd::::d oo:::::::::::oo 
//      TTTTTTTTTTT      ooooooooooo      ddddddddd   ddddd   ooooooooooo   
//
// Un-hack this file, and improve the interface of the core to make it a LOT cleaner

"use strict";

Rubikjs.Puzzle.ClassicRubiksCube = function(renderManager) {
    if(renderManager == undefined) {
        return;
    }
    Rubikjs.Twisty.FixedPiecePlace.call(this);
    this.rendermgr = renderManager;
    this.turnDegree = 90;
    this.notation = new Rubikjs.Puzzle.ClassicRubiksCube.Notation(this);

    //      Graphic init

    var cubeMesh = this.rendermgr.renderer.createMesh();
    cubeMesh.vertexBuffer.feed([
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ]);
    var colors = [
        [1.0, 0.0, 0.0, 1.0],     // Front face
        [1.0, 0.5, 0.0, 1.0],     // Back face
        [0.9, 0.9, 0.9, 1.0],     // Top face
        [1.0, 1.0, 0.0, 1.0],     // Bottom face
        [0.0, 0.0, 1.0, 1.0],     // Right face
        [0.0, 1.0, 0.0, 1.0]     // Left face
    ];

    var unpackedColors = [];
    for (var i = 0; i < colors.length; ++i) {
        var color = colors[i];
        for (var j = 0; j < 4; ++j) {
            unpackedColors = unpackedColors.concat(color);
        }
    }

    cubeMesh.colorBuffer.feed(unpackedColors);


    cubeMesh.indexBuffer.feed([
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ]);

    //      Groups init

    var translations = {
        UBL: [-2,  2, -2],
        UBR: [ 2,  2, -2],
        UFR: [ 2,  2,  2],
        UFL: [-2,  2,  2],
        DBL: [-2, -2, -2],
        DBR: [ 2, -2, -2],
        DFR: [ 2, -2,  2],
        DFL: [-2, -2,  2],

        UB: [ 0,  2, -2],
        UR: [ 2,  2,  0],
        UF: [ 0,  2,  2],
        UL: [-2,  2,  0],
        FL: [-2,  0,  2],
        FR: [ 2,  0,  2],
        BR: [ 2,  0, -2],
        BL: [-2,  0, -2],
        DF: [ 0, -2,  2],
        DR: [ 2, -2,  0],
        DB: [ 0, -2, -2],
        DL: [-2, -2,  0],

        U: [ 0,  2,  0],
        L: [-2,  0,  0],
        F: [ 0,  0,  2],
        R: [ 2,  0,  0],
        B: [ 0,  0, -2],
        D: [ 0, -2,  0]
    };

    for(var i in translations) {
        var piece = new Object;
        piece.movable = new Object;
        piece.movable.mesh = new Rubikjs.Render.Mesh;
        piece.movable.mesh.vertexBuffer = cubeMesh.vertexBuffer;
        piece.movable.mesh.colorBuffer = cubeMesh.colorBuffer;
        piece.movable.mesh.indexBuffer = cubeMesh.indexBuffer;
        mat4.translate(piece.movable.mesh.transform, translations[i]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }


    this.groups.U = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.U.pieces = [["UBL", "UBR", "UFR", "UFL"], ["UB", "UR", "UF", "UL"], ["U"]];
    this.groups.U.rotationAxis = [0, 1, 0];
    this.groups.U.rotationCenter = [0, 2, 0];

    this.groups.L = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.L.pieces = [["UBL", "UFL", "DFL", "DBL"], ["UL", "FL", "DL", "BL"], ["L"]];
    this.groups.L.rotationAxis = [-1, 0, 0];
    this.groups.L.rotationCenter = [-2, 0, 0];

    this.groups.F = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.F.pieces = [["UFR", "DFR", "DFL", "UFL"], ["UF", "FR", "DF", "FL"], ["F"]];
    this.groups.F.rotationAxis = [0, 0, 1];
    this.groups.F.rotationCenter = [0, 0, 2];

    this.groups.R = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.R.pieces = [["UBR", "DBR", "DFR", "UFR"], ["UR", "BR", "DR", "FR"], ["R"]];
    this.groups.R.rotationAxis = [1, 0, 0];
    this.groups.R.rotationCenter = [2, 0, 0];

    this.groups.B = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.B.pieces = [["UBR", "UBL", "DBL", "DBR"], ["UB", "BL", "DB", "BR"], ["B"]];
    this.groups.B.rotationAxis = [0, 0, -1];
    this.groups.B.rotationCenter = [0, 0, -2];

    this.groups.D = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.D.pieces = [["DBL", "DFL", "DFR", "DBR"], ["DF", "DR", "DB", "DL"], ["D"]];
    this.groups.D.rotationAxis = [0, -1, 0];
    this.groups.D.rotationCenter = [0, -2, 0];

    this.groups.M = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.M.pieces = [["UF", "DF", "DB", "UB"], ["U", "F", "D", "B"]];
    this.groups.M.rotationAxis = [-1, 0, 0];
    this.groups.M.rotationCenter = [0, 0, 0];

    this.groups.S = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.S.pieces = [["UL", "UR", "DR", "DL"], ["U", "R", "D", "L"]];
    this.groups.S.rotationAxis = [0, 0, 1];
    this.groups.S.rotationCenter = [0, 0, 0];

    this.groups.E = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.E.pieces = [["FL", "FR", "BR", "BL"], ["F", "R", "B", "L"]];
    this.groups.E.rotationAxis = [0, -1, 0];
    this.groups.E.rotationCenter = [0, 0, 0];

    this.groups.u = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["U", 1], ["E", -1]]);
    this.groups.l = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["L", 1], ["M",  1]]);
    this.groups.f = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["F", 1], ["S",  1]]);
    this.groups.r = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["R", 1], ["M", -1]]);
    this.groups.b = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["B", 1], ["S", -1]]);
    this.groups.d = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["D", 1], ["E",  1]]);

    this.groups.X = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["R", 1], ["M", -1], ["L", -1]]);
    this.groups.Y = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["U", 1], ["E", -1], ["D", -1]]);
    this.groups.Z = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["F", 1], ["S",  1], ["B", -1]]);

    this.groups.x = this.groups.X;
    this.groups.y = this.groups.Y;
    this.groups.z = this.groups.Z;

    this.endInit();
};

Rubikjs.Puzzle.ClassicRubiksCube.prototype = new Rubikjs.Twisty.FixedPiecePlace;
Rubikjs.Puzzle.ClassicRubiksCube.prototype.constructor = new Rubikjs.Puzzle.ClassicRubiksCube;



Rubikjs.Puzzle.ClassicRubiksCube.Notation = function(twisty) {
    this.twisty = twisty;
};

Rubikjs.Puzzle.ClassicRubiksCube.Notation.prototype = new Rubikjs.Notation.Parser;
Rubikjs.Puzzle.ClassicRubiksCube.Notation.prototype.constructor = new Rubikjs.Puzzle.ClassicRubiksCube.Notation;


Rubikjs.Puzzle.ClassicRubiksCube.Notation.prototype.parseToken = function(token) {
    var group = token[0];

    var count = this.getCount(token.slice(1));
    if(count != count) { //If count == NaN
        count = 1;
    }

    if(this.twisty.groups[group] != undefined) {
        return new Rubikjs.Notation.Move(this.twisty.groups[group], count);
    } else {
        return new Rubikjs.Notation.Instruction();
    }
};

