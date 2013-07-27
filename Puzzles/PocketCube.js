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

Rubikjs.Puzzle.PocketCube = function(renderManager, options) {
    if(renderManager == undefined) {
        return;
    }
    Rubikjs.Twisty.FixedPiecePlace.call(this);
    this.rendermgr = renderManager;
    this.turnDegree = 90;
    this.notation = new Rubikjs.Twisty.FixedPiecePlace.DefaultNotation(this);

    this.options = {};
    var defaultOptions = {
        colorscheme: {
            U: [1.0, 1.0, 1.0, 1.0],
            D: [1.0, 1.0, 0.0, 1.0],
            L: [0.0, 1.0, 0.0, 1.0],
            R: [0.0, 0.0, 1.0, 1.0],
            F: [1.0, 0.0, 0.0, 1.0],
            B: [1.0, 0.5, 0.0, 1.0],
        },
        plasticColor: [0.0, 0.0, 0.0, 1.0],
        minimal: false,
        stickerDist: 0.01,
        stickerMargin: 0.1,
        backStickerEnabled: true,
        backStickerDist: 2,
        backStickerMargin: 0.1,
    };
    if(options) {
        for(var key in defaultOptions) {
            this.options[key] = defaultOptions[key];
        }
        for(var key in options) {
            this.options[key] = options[key];
        }
    } else {
        this.options = defaultOptions;
    }

    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -8]);
    mat4.rotateX(cameraMatrix, cameraMatrix, Math.PI/6);
    mat4.rotateY(cameraMatrix, cameraMatrix, -Math.PI/6);
    this.rendermgr.transformCamera(cameraMatrix);

    this.initGroups();
    this.initGraphics();

    this.endInit();
};

Rubikjs.Puzzle.PocketCube.prototype = new Rubikjs.Twisty.FixedPiecePlace;
Rubikjs.Puzzle.PocketCube.prototype.constructor = new Rubikjs.Puzzle.PocketCube;


Rubikjs.Puzzle.PocketCube.prototype.initGroups = function() {
    this.groups.U = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.U.pieces = [["UBL", "UBR", "UFR", "UFL"]];
    this.groups.U.rotationAxis = [0, 1, 0];
    this.groups.U.rotationCenter = [0, 2, 0];

    this.groups.L = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.L.pieces = [["UBL", "UFL", "DFL", "DBL"]];
    this.groups.L.rotationAxis = [-1, 0, 0];
    this.groups.L.rotationCenter = [-2, 0, 0];

    this.groups.F = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.F.pieces = [["UFR", "DFR", "DFL", "UFL"]];
    this.groups.F.rotationAxis = [0, 0, 1];
    this.groups.F.rotationCenter = [0, 0, 2];

    this.groups.R = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.R.pieces = [["UBR", "DBR", "DFR", "UFR"]];
    this.groups.R.rotationAxis = [1, 0, 0];
    this.groups.R.rotationCenter = [2, 0, 0];

    this.groups.B = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.B.pieces = [["UBR", "UBL", "DBL", "DBR"]];
    this.groups.B.rotationAxis = [0, 0, -1];
    this.groups.B.rotationCenter = [0, 0, -2];

    this.groups.D = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.D.pieces = [["DBL", "DFL", "DFR", "DBR"]];
    this.groups.D.rotationAxis = [0, -1, 0];
    this.groups.D.rotationCenter = [0, -2, 0];

    this.groups.X = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["R", 1], ["L", -1]]);
    this.groups.Y = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["U", 1], ["D", -1]]);
    this.groups.Z = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["F", 1], ["B", -1]]);

    this.groups.x = this.groups.X;
    this.groups.y = this.groups.Y;
    this.groups.z = this.groups.Z;
};


Rubikjs.Puzzle.PocketCube.prototype.initGraphics = function() {
    var cubie = this.rendermgr.renderer.createMesh();
    if(this.options.minimal) {
        cubie.vertexBuffer.feed([]);
        cubie.indexBuffer.feed([]);
        var colors = [];
    } else {
        cubie.vertexBuffer.feed([
            -1.0, -1.0, -1.0, //0
            -1.0, -1.0,  1.0, //1
            -1.0,  1.0, -1.0, //2
            -1.0,  1.0,  1.0, //3
             1.0, -1.0, -1.0, //4
             1.0, -1.0,  1.0, //5
             1.0,  1.0, -1.0, //6
             1.0,  1.0,  1.0, //7
        ]);

        cubie.indexBuffer.feed([
            1, 5, 7,    1, 7, 3, // F
            0, 2, 6,    0, 6, 4, // B
            2, 3, 7,    2, 7, 6, // U
            0, 4, 5,    0, 5, 1, // D
            4, 6, 7,    4, 7, 5, // R
            0, 1, 3,    0, 3, 2  // L
        ]);

        var colors = ["p", "p", "p", "p", "p", "p", "p", "p"];
    }

    var colorscheme = this.options.colorscheme;
    var pi = Math.PI;
    var pi2 = pi/2;
    var stickerZ = 1 + this.options.stickerDist;
    var stickerXY = 1 - this.options.stickerMargin;
    var bStickerZ = 1 + this.options.backStickerDist;
    var bStickerXY = 1 - this.options.backStickerMargin;

    // ----- Corners -----

    var cornerMesh = this.rendermgr.renderer.createMesh();
    cornerMesh.vertexBuffer.feed(cubie.vertexBuffer.data.concat([
        // F
        -stickerXY, -stickerXY,  stickerZ,
         stickerXY, -stickerXY,  stickerZ,
         stickerXY,  stickerXY,  stickerZ,
        -stickerXY,  stickerXY,  stickerZ,
        // U
        -stickerXY,  stickerZ,  -stickerXY,
        -stickerXY,  stickerZ,   stickerXY,
         stickerXY,  stickerZ,   stickerXY,
         stickerXY,  stickerZ,  -stickerXY,
        // R
         stickerZ,  -stickerXY, -stickerXY,
         stickerZ,   stickerXY, -stickerXY,
         stickerZ,   stickerXY,  stickerXY,
         stickerZ,  -stickerXY,  stickerXY
    ]));

    cornerMesh.indexBuffer.feed(cubie.indexBuffer.data.concat([
        0, 1, 2,      0, 2, 3,    // F
        4, 5, 6,      4, 6, 7,    // U
        8, 9, 10,     8, 10, 11   // R
    ].map(function(d) {
        return d + cubie.vertexBuffer.data.length/3;
    })));

    var cornerColors = colors.concat([
        "F", "F", "F", "F",
        "U", "U", "U", "U",
        "R", "R", "R", "R"
    ]);

    var cornerDefaultColors = {
        p: this.options.plasticColor,
        F: [0.5, 0.5, 0.5, 1.0],
        U: [0.5, 0.5, 0.5, 1.0],
        R: [0.5, 0.5, 0.5, 1.0]
    };

    if(this.options.backStickerEnabled) {
        cornerMesh.indexBuffer.feed(cornerMesh.indexBuffer.data.concat([
            0, 2, 1,      0, 3, 2,    // F
            4, 6, 5,      4, 7, 6,    // U
            8, 10, 9,     8, 11, 10   // R
        ].map(function(d) {
            return d + cornerMesh.vertexBuffer.data.length/3;
        })));

        cornerMesh.vertexBuffer.feed(cornerMesh.vertexBuffer.data.concat([
            // F
            -bStickerXY, -bStickerXY,  bStickerZ,
             bStickerXY, -bStickerXY,  bStickerZ,
             bStickerXY,  bStickerXY,  bStickerZ,
            -bStickerXY,  bStickerXY,  bStickerZ,
            // U
            -bStickerXY,  bStickerZ,  -bStickerXY,
            -bStickerXY,  bStickerZ,   bStickerXY,
             bStickerXY,  bStickerZ,   bStickerXY,
             bStickerXY,  bStickerZ,  -bStickerXY,
            // R
             bStickerZ,  -bStickerXY, -bStickerXY,
             bStickerZ,   bStickerXY, -bStickerXY,
             bStickerZ,   bStickerXY,  bStickerXY,
             bStickerZ,  -bStickerXY,  bStickerXY
        ]));

        cornerColors = cornerColors.concat([
            "F", "F", "F", "F",
            "U", "U", "U", "U",
            "R", "R", "R", "R"
        ]);
    }

    var cornerFactory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, cornerMesh.vertexBuffer, cornerMesh.indexBuffer, cornerMesh.colorBuffer, cornerColors, cornerDefaultColors);

    var corners = {
        UBL: [[-1,  1, -1], [0,    pi, 0], {U: colorscheme.U, F: colorscheme.B, R: colorscheme.L}],
        UBR: [[ 1,  1, -1], [0,   pi2, 0], {U: colorscheme.U, F: colorscheme.R, R: colorscheme.B}],
        UFR: [[ 1,  1,  1], [0,     0, 0], {U: colorscheme.U, F: colorscheme.F, R: colorscheme.R}],
        UFL: [[-1,  1,  1], [0,  -pi2, 0], {U: colorscheme.U, F: colorscheme.L, R: colorscheme.F}],
        DBL: [[-1, -1, -1], [pi, -pi2, 0], {U: colorscheme.D, F: colorscheme.L, R: colorscheme.B}],
        DBR: [[ 1, -1, -1], [pi,    0, 0], {U: colorscheme.D, F: colorscheme.B, R: colorscheme.R}],
        DFR: [[ 1, -1,  1], [pi,  pi2, 0], {U: colorscheme.D, F: colorscheme.R, R: colorscheme.F}],
        DFL: [[-1, -1,  1], [pi,   pi, 0], {U: colorscheme.D, F: colorscheme.F, R: colorscheme.L}]
    };
    for(var i in corners) {
        var piece = cornerFactory.create(corners[i][0], corners[i][1], corners[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }
};
