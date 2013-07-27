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

Rubikjs.Puzzle.ClassicRubiksCube = function(renderManager, options) {
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
    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -12]);
    mat4.rotateX(cameraMatrix, cameraMatrix, Math.PI/6);
    mat4.rotateY(cameraMatrix, cameraMatrix, -Math.PI/6);
    this.rendermgr.transformCamera(cameraMatrix);

    this.initGroups();
    this.initGraphics();

    this.endInit();
};

Rubikjs.Puzzle.ClassicRubiksCube.prototype = new Rubikjs.Twisty.FixedPiecePlace;
Rubikjs.Puzzle.ClassicRubiksCube.prototype.constructor = new Rubikjs.Puzzle.ClassicRubiksCube;


Rubikjs.Puzzle.ClassicRubiksCube.prototype.initGroups = function() {
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

    this.groups.Uw = this.groups.u;
    this.groups.Lw = this.groups.l;
    this.groups.Fw = this.groups.f;
    this.groups.Rw = this.groups.r;
    this.groups.Bw = this.groups.b;
    this.groups.Dw = this.groups.d;

    this.groups.X = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["R", 1], ["M", -1], ["L", -1]]);
    this.groups.Y = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["U", 1], ["E", -1], ["D", -1]]);
    this.groups.Z = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["F", 1], ["S",  1], ["B", -1]]);

    this.groups.x = this.groups.X;
    this.groups.y = this.groups.Y;
    this.groups.z = this.groups.Z;
};


Rubikjs.Puzzle.ClassicRubiksCube.prototype.initGraphics = function() {
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
        UBL: [[-2,  2, -2], [0,    pi, 0], {U: colorscheme.U, F: colorscheme.B, R: colorscheme.L}],
        UBR: [[ 2,  2, -2], [0,   pi2, 0], {U: colorscheme.U, F: colorscheme.R, R: colorscheme.B}],
        UFR: [[ 2,  2,  2], [0,     0, 0], {U: colorscheme.U, F: colorscheme.F, R: colorscheme.R}],
        UFL: [[-2,  2,  2], [0,  -pi2, 0], {U: colorscheme.U, F: colorscheme.L, R: colorscheme.F}],
        DBL: [[-2, -2, -2], [pi, -pi2, 0], {U: colorscheme.D, F: colorscheme.L, R: colorscheme.B}],
        DBR: [[ 2, -2, -2], [pi,    0, 0], {U: colorscheme.D, F: colorscheme.B, R: colorscheme.R}],
        DFR: [[ 2, -2,  2], [pi,  pi2, 0], {U: colorscheme.D, F: colorscheme.R, R: colorscheme.F}],
        DFL: [[-2, -2,  2], [pi,   pi, 0], {U: colorscheme.D, F: colorscheme.F, R: colorscheme.L}]
    };
    for(var i in corners) {
        var piece = cornerFactory.create(corners[i][0], corners[i][1], corners[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }

    // ----- Edges -----

    var edgeMesh = this.rendermgr.renderer.createMesh();
    edgeMesh.vertexBuffer.feed(cubie.vertexBuffer.data.concat([
        // F
        -stickerXY, -stickerXY, stickerZ,
         stickerXY, -stickerXY, stickerZ,
         stickerXY,  stickerXY, stickerZ,
        -stickerXY,  stickerXY, stickerZ,
        // U
        -stickerXY,  stickerZ, -stickerXY,
        -stickerXY,  stickerZ,  stickerXY,
         stickerXY,  stickerZ,  stickerXY,
         stickerXY,  stickerZ, -stickerXY
    ]));

    edgeMesh.indexBuffer.feed(cubie.indexBuffer.data.concat([
        0, 1, 2,      0, 2, 3,    // F
        4, 5, 6,      4, 6, 7     // U
    ].map(function(d) {
        return d + cubie.vertexBuffer.data.length/3;
    })));

    var edgeColors = colors.concat([
        "F", "F", "F", "F",
        "U", "U", "U", "U"
    ]);

    var edgeDefaultColors = {
        p: this.options.plasticColor,
        F: [0.5, 0.5, 0.5, 1.0],
        U: [0.5, 0.5, 0.5, 1.0]
    };

    if(this.options.backStickerEnabled) {
        edgeMesh.indexBuffer.feed(edgeMesh.indexBuffer.data.concat([
            0, 2, 1,      0, 3, 2,    // F
            4, 6, 5,      4, 7, 6     // U
        ].map(function(d) {
            return d + edgeMesh.vertexBuffer.data.length/3;
        })));

        edgeMesh.vertexBuffer.feed(edgeMesh.vertexBuffer.data.concat([
            // F
            -bStickerXY, -bStickerXY, bStickerZ,
             bStickerXY, -bStickerXY, bStickerZ,
             bStickerXY,  bStickerXY, bStickerZ,
            -bStickerXY,  bStickerXY, bStickerZ,
            // U
            -bStickerXY,  bStickerZ, -bStickerXY,
            -bStickerXY,  bStickerZ,  bStickerXY,
             bStickerXY,  bStickerZ,  bStickerXY,
             bStickerXY,  bStickerZ, -bStickerXY
        ]));

        edgeColors = edgeColors.concat([
            "F", "F", "F", "F",
            "U", "U", "U", "U",
        ]);
    }

    var edgeFactory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, edgeMesh.vertexBuffer, edgeMesh.indexBuffer, edgeMesh.colorBuffer, edgeColors, edgeDefaultColors);

    var edges = {
        UB: [[ 0,  2, -2], [0,   pi,    0], {U: colorscheme.U, F: colorscheme.B}],
        UR: [[ 2,  2,  0], [0,  pi2,    0], {U: colorscheme.U, F: colorscheme.R}],
        UF: [[ 0,  2,  2], [0,    0,    0], {U: colorscheme.U, F: colorscheme.F}],
        UL: [[-2,  2,  0], [0, -pi2,    0], {U: colorscheme.U, F: colorscheme.L}],
        FL: [[-2,  0,  2], [0,    0,  pi2], {U: colorscheme.L, F: colorscheme.F}],
        FR: [[ 2,  0,  2], [0,    0, -pi2], {U: colorscheme.R, F: colorscheme.F}],
        BR: [[ 2,  0, -2], [0,   pi,  pi2], {U: colorscheme.R, F: colorscheme.B}],
        BL: [[-2,  0, -2], [0,   pi, -pi2], {U: colorscheme.L, F: colorscheme.B}],
        DF: [[ 0, -2,  2], [0,    0,   pi], {U: colorscheme.D, F: colorscheme.F}],
        DR: [[ 2, -2,  0], [0,  pi2,    pi], {U: colorscheme.D, F: colorscheme.R}],
        DB: [[ 0, -2, -2], [0,   pi,    pi], {U: colorscheme.D, F: colorscheme.B}],
        DL: [[-2, -2,  0], [0, -pi2,    pi], {U: colorscheme.D, F: colorscheme.L}]
    };

    for(var i in edges) {
        var piece = edgeFactory.create(edges[i][0], edges[i][1], edges[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }

    // ----- Centers -----

    var centerMesh = this.rendermgr.renderer.createMesh();
    centerMesh.vertexBuffer.feed(cubie.vertexBuffer.data.concat([
        // U
        -stickerXY, stickerZ, -stickerXY,
        -stickerXY, stickerZ,  stickerXY,
         stickerXY, stickerZ,  stickerXY,
         stickerXY, stickerZ, -stickerXY,
    ]));

    centerMesh.indexBuffer.feed(cubie.indexBuffer.data.concat([
        0, 1, 2,      0, 2, 3     // U
    ].map(function(d) {
        return d + cubie.vertexBuffer.data.length/3;
    })));

    var centerColors = colors.concat([
        "U", "U", "U", "U"
    ]);

    var centerDefaultColors = {
        p: this.options.plasticColor,
        U: [0.5, 0.5, 0.5, 1.0],
    };

    if(this.options.backStickerEnabled) {
        centerMesh.indexBuffer.feed(centerMesh.indexBuffer.data.concat([
            0, 2, 1,      0, 3, 2     // U
        ].map(function(d) {
            return d + centerMesh.vertexBuffer.data.length/3;
        })));

        centerMesh.vertexBuffer.feed(centerMesh.vertexBuffer.data.concat([
            // U
            -bStickerXY, bStickerZ, -bStickerXY,
            -bStickerXY, bStickerZ,  bStickerXY,
             bStickerXY, bStickerZ,  bStickerXY,
             bStickerXY, bStickerZ, -bStickerXY,
        ]));

        var centerColors = centerColors.concat([
            "U", "U", "U", "U"
        ]);
    }

    var centerFactory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, centerMesh.vertexBuffer, centerMesh.indexBuffer, centerMesh.colorBuffer, centerColors, centerDefaultColors);

    var centers = {
        U: [[ 0,  2,  0], [0,    0,    0], {U: colorscheme.U}],
        L: [[-2,  0,  0], [0,    0,  pi2], {U: colorscheme.L}],
        F: [[ 0,  0,  2], [pi2,  0,    0], {U: colorscheme.F}],
        R: [[ 2,  0,  0], [0,    0, -pi2], {U: colorscheme.R}],
        B: [[ 0,  0, -2], [-pi2, 0,    0], {U: colorscheme.B}],
        D: [[ 0, -2,  0], [pi,   0,    0], {U: colorscheme.D}]
    };

    for(var i in centers) {
        var piece = centerFactory.create(centers[i][0], centers[i][1], centers[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }
};
