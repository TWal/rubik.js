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

    var translations = [
        [-2,  2, -2], //UBL 0
        [ 2,  2, -2], //UBR 1
        [ 2,  2,  2], //UFR 2
        [-2,  2,  2], //UFL 3
        [-2, -2, -2], //DBL 4
        [ 2, -2, -2], //DBR 5
        [ 2, -2,  2], //DFR 6
        [-2, -2,  2], //DFL 7

        [ 0,  2, -2], //UB 8
        [ 2,  2,  0], //UR 9
        [ 0,  2,  2], //UF 10
        [-2,  2,  0], //UL 11
        [-2,  0,  2], //FL 12
        [ 2,  0,  2], //FR 13
        [ 2,  0, -2], //BR 14
        [-2,  0, -2], //BL 15
        [ 0, -2,  2], //DF 16
        [ 2, -2,  0], //DR 17
        [ 0, -2, -2], //DB 18
        [-2, -2,  0], //DL 19

        [ 0,  2,  0], //U 20
        [-2,  0,  0], //L 21
        [ 0,  0,  2], //F 22
        [ 2,  0,  0], //R 23
        [ 0,  0, -2], //B 24
        [ 0, -2,  0]  //D 25
    ];

    for(var i = 0; i < 26; ++i) {
        var piece = new Object;
        piece.movable = new Object;
        piece.movable.mesh = new Rubikjs.Render.Mesh;
        piece.movable.mesh.vertexBuffer = cubeMesh.vertexBuffer;
        piece.movable.mesh.colorBuffer = cubeMesh.colorBuffer;
        piece.movable.mesh.indexBuffer = cubeMesh.indexBuffer;
        mat4.translate(piece.movable.mesh.transform, translations[i]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces.push(piece);
    }

    var self = this;

    var transformPieces = function(piecesId) {
        return piecesId.map(function(piecesId2) {
            return piecesId2.map(function(pieceId) {
                return self.pieces[pieceId];
            })
        })
    };


    this.faces = new Object;

    this.faces.U = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.faces.U.pieces = transformPieces([[0, 1, 2, 3], [8, 9, 10, 11], [20]]);
    this.faces.U.rotationAxis = [0, 1, 0];
    this.faces.U.rotationCenter = [0, 2, 0];
    
    this.faces.L = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.faces.L.pieces = transformPieces([[0, 3, 7, 4], [11, 12, 19, 15], [21]]);
    this.faces.L.rotationAxis = [1, 0, 0];
    this.faces.L.rotationCenter = [-2, 0, 0];
    
    this.faces.F = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.faces.F.pieces = transformPieces([[2, 6, 7, 3], [10, 13, 16, 12], [22]]);
    this.faces.F.rotationAxis = [0, 0, 1];
    this.faces.F.rotationCenter = [0, 0, 2];
    
    this.faces.R = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.faces.R.pieces = transformPieces([[1, 5, 6, 2], [9, 14, 17, 13], [23]]);
    this.faces.R.rotationAxis = [1, 0, 0];
    this.faces.R.rotationCenter = [2, 0, 0];
    
    this.faces.B = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.faces.B.pieces = transformPieces([[1, 0, 4, 5], [8, 15, 18, 14], [24]]);
    this.faces.B.rotationAxis = [0, 0, 1];
    this.faces.B.rotationCenter = [0, 0, -2];
    
    this.faces.D = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.faces.D.pieces = transformPieces([[4, 7, 6, 5], [16, 17, 18, 19], [25]]);
    this.faces.D.rotationAxis = [0, 1, 0];
    this.faces.D.rotationCenter = [0, -2, 0];

    /*this.pieces.forEach(function(piece) {
        mat4.translate(piece.movable.mesh.transform, [0, 0, -10]);
    });*/
}

Rubikjs.Puzzle.ClassicRubiksCube.prototype = new Rubikjs.Twisty.FixedPiecePlace;
Rubikjs.Puzzle.ClassicRubiksCube.prototype.constructor = new Rubikjs.Puzzle.ClassicRubiksCube;

