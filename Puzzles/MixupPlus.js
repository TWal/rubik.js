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

Rubikjs.Puzzle.MixupPlus = function(renderManager, options) {
    if(renderManager == undefined) {
        return;
    }
    Rubikjs.Twisty.FixedPiecePlace.call(this);
    this.rendermgr = renderManager;
    this.turnDegree = 90;
    this.notation = new Rubikjs.Puzzle.MixupPlus.Notation(this);

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
    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -11]);
    mat4.rotateX(cameraMatrix, cameraMatrix, Math.PI/6);
    mat4.rotateY(cameraMatrix, cameraMatrix, -Math.PI/6);
    this.rendermgr.transformCamera(cameraMatrix);

    this.initGroups();
    this.initGraphics();

    this.endInit();
};

Rubikjs.Puzzle.MixupPlus.prototype = new Rubikjs.Twisty.FixedPiecePlace;
Rubikjs.Puzzle.MixupPlus.prototype.constructor = new Rubikjs.Puzzle.MixupPlus;


Rubikjs.Puzzle.MixupPlus.prototype.initGroups = function() {
    this.groups.U = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UBL", "UBR", "UFR", "UFL"], ["UB", "UR", "UF", "UL"], ["U"], ["ub", "ur", "uf", "ul"], ["bu", "ru", "fu", "lu"]],
        rotationAxis: [0, 1, 0],
        rotationCenter: [0, 2, 0]
    });

    this.groups.L = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UBL", "UFL", "DFL", "DBL"], ["UL", "FL", "DL", "BL"], ["L"], ["lu", "lf", "ld", "lb"], ["ul", "fl", "dl", "bl"]],
        rotationAxis: [-1, 0, 0],
        rotationCenter: [-2, 0, 0]
    });

    this.groups.F = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UFR", "DFR", "DFL", "UFL"], ["UF", "FR", "DF", "FL"], ["F"], ["fu", "fr", "fd", "fl"], ["uf", "rf", "df", "lf"]],
        rotationAxis: [0, 0, 1],
        rotationCenter: [0, 0, 2]
    });

    this.groups.R = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UBR", "DBR", "DFR", "UFR"], ["UR", "BR", "DR", "FR"], ["R"], ["ru", "rb", "rd", "rf"], ["ur", "br", "dr", "fr"]],
        rotationAxis: [1, 0, 0],
        rotationCenter: [2, 0, 0]
    });

    this.groups.B = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UBR", "UBL", "DBL", "DBR"], ["UB", "BL", "DB", "BR"], ["B"], ["bu", "bl", "bd", "br"], ["ub", "lb", "db", "rb"]],
        rotationAxis: [0, 0, -1],
        rotationCenter: [0, 0, -2]
    });

    this.groups.D = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["DBL", "DFL", "DFR", "DBR"], ["DF", "DR", "DB", "DL"], ["D"], ["df", "dr", "db", "dl"], ["fd", "rd", "bd", "ld"]],
        rotationAxis: [0, -1, 0],
        rotationCenter: [0, -2, 0]
    });

    this.groups.M = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UF", "F", "DF", "D", "DB", "B", "UB", "U"], ["ub", "uf", "fu", "fd", "df", "db", "bd", "bu"]],
        rotationAxis: [-1, 0, 0],
        rotationCenter: [0, 0, 0],
        turnDegree: 45
    });

    this.groups.S = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UL", "U", "UR", "R", "DR", "D", "DL", "L"], ["ul", "ur", "ru", "rd", "dr", "dl", "ld", "lu"]],
        rotationAxis: [0, 0, 1],
        rotationCenter: [0, 0, 0],
        turnDegree: 45
    });

    this.groups.E = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["FL", "F", "FR", "R", "BR", "B", "BL", "L"], ["fl", "fr", "rf", "rb", "br", "bl", "lb", "lf"]],
        rotationAxis: [0, -1, 0],
        rotationCenter: [0, 0, 0],
        turnDegree: 45
    });

    this.groups.u = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["U", 1], ["E", -2]]);
    this.groups.l = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["L", 1], ["M",  2]]);
    this.groups.f = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["F", 1], ["S",  2]]);
    this.groups.r = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["R", 1], ["M", -2]]);
    this.groups.b = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["B", 1], ["S", -2]]);
    this.groups.d = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["D", 1], ["E",  2]]);

    this.groups.Uw = this.groups.u;
    this.groups.Lw = this.groups.l;
    this.groups.Fw = this.groups.f;
    this.groups.Rw = this.groups.r;
    this.groups.Bw = this.groups.b;
    this.groups.Dw = this.groups.d;

    this.groups.X = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["R", 1], ["M", -2], ["L", -1]]);
    this.groups.Y = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["U", 1], ["E", -2], ["D", -1]]);
    this.groups.Z = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["F", 1], ["S",  2], ["B", -1]]);

    this.groups.x = this.groups.X;
    this.groups.y = this.groups.Y;
    this.groups.z = this.groups.Z;
};

Rubikjs.Puzzle.MixupPlus.Notation = function(twisty) {
    this.twisty = twisty;
};

Rubikjs.Puzzle.MixupPlus.Notation.prototype = new Rubikjs.Notation.Parser;
Rubikjs.Puzzle.MixupPlus.Notation.prototype.constructor = new Rubikjs.Puzzle.MixupPlus.Notation;


Rubikjs.Puzzle.MixupPlus.Notation.prototype.parseToken = function(token) {
    var groupLength = this.groupNameLength(token, "0123456789'+-");
    var group = token.substr(0, groupLength);

    var count = this.getCount(token.substr(groupLength));
    console.log(count);

    if(group == "M" || group == "E" || group == "S") {
        count *= 2;
    }
    console.log(count);

    if(this.twisty.groups[group] != undefined) {
        return new Rubikjs.Notation.Move(this.twisty.groups[group], count);
    } else {
        Rubikjs.Core.Logger.log("Twisty", "Undefined group name: '" + group + "'", "warn");
        return new Rubikjs.Notation.Instruction();
    }
};

Rubikjs.Puzzle.MixupPlus.Notation.prototype.getCount = function(str) {
    //Special cases
    if(str == "") {
        return 1;
    } else if(str == "'") {
        return -1;
    } else if(str == "+") {
        return 0.5;
    } else if(str == "-") {
        return -0.5;
    } else {
        var count = parseInt(str);
        if(count != count) { //If count == NaN
            return 1;
        }
        if(str[str.length - 1] == "'") {
            return -count;
        } else if(str[str.length - 1] == "+") {
            return count * 0.5;
        } else if(str[str.length - 1] == "-") {
            return count * -0.5;
        } else {
            return count;
        }
    }
};

Rubikjs.Puzzle.MixupPlus.prototype.initGraphics = function() {
    var colorscheme = this.options.colorscheme;
    var pi = Math.PI;
    var pi2 = pi/2;

    // ----- Corners -----

    var self = this;
    (function() {
        var mesh = self.rendermgr.renderer.createMesh();
        if(self.options.minimal) {
            mesh.vertexBuffer.feed([]);
            mesh.indexBuffer.feed([]);
            var colors = [];
        } else {
            mesh.vertexBuffer.feed([
                -1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0,
                -1.0,  1.0, -1.0,
                -1.0,  1.0,  1.0,
                 1.0, -1.0, -1.0,
                 1.0, -1.0,  1.0,
                 1.0,  1.0, -1.0,
                 1.0,  1.0,  1.0,
            ]);

            mesh.indexBuffer.feed([
                1, 5, 7,    1, 7, 3, // F
                0, 2, 6,    0, 6, 4, // B
                2, 3, 7,    2, 7, 6, // U
                0, 4, 5,    0, 5, 1, // D
                4, 6, 7,    4, 7, 5, // R
                0, 1, 3,    0, 3, 2  // L
            ]);

            var colors = ["p", "p", "p", "p", "p", "p", "p", "p"];
        }

        var stickerGenerator = function(margin, distance) {
            var stickerZ = 1 + distance;
            var stickerXY = 1 - margin;
            colors = colors.concat([
                "U", "U", "U", "U",
                "F", "F", "F", "F",
                "R", "R", "R", "R"
            ]);

            return {
                vertex: [
                    // U
                    -stickerXY,  stickerZ,  -stickerXY,
                    -stickerXY,  stickerZ,   stickerXY,
                     stickerXY,  stickerZ,   stickerXY,
                     stickerXY,  stickerZ,  -stickerXY,
                    // F
                    -stickerXY, -stickerXY,  stickerZ,
                     stickerXY, -stickerXY,  stickerZ,
                     stickerXY,  stickerXY,  stickerZ,
                    -stickerXY,  stickerXY,  stickerZ,
                    // R
                     stickerZ,  -stickerXY, -stickerXY,
                     stickerZ,   stickerXY, -stickerXY,
                     stickerZ,   stickerXY,  stickerXY,
                     stickerZ,  -stickerXY,  stickerXY
                ],
                index: [
                    0, 1, 2,      0, 2, 3,    // U
                    4, 5, 6,      4, 6, 7,    // F
                    8, 9, 10,     8, 10, 11   // R
                ]
            };
        };

        var defaultColors = {
            p: self.options.plasticColor,
            F: [0.5, 0.5, 0.5, 1.0],
            U: [0.5, 0.5, 0.5, 1.0],
            R: [0.5, 0.5, 0.5, 1.0]
        };


        var stickerCreator = new Rubikjs.Render.StickerHelper(stickerGenerator);
        stickerCreator.create(mesh, self.options.stickerMargin, self.options.stickerDist, false);

        if(self.options.backStickerEnabled) {
            stickerCreator.create(mesh, self.options.backStickerMargin, self.options.backStickerDist, true);
        }

        var factory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, mesh, colors, defaultColors);

        var corners = {
            UBL: [[-1.75,  1.75, -1.75], [0,    pi, 0], {U: colorscheme.U, F: colorscheme.B, R: colorscheme.L}],
            UBR: [[ 1.75,  1.75, -1.75], [0,   pi2, 0], {U: colorscheme.U, F: colorscheme.R, R: colorscheme.B}],
            UFR: [[ 1.75,  1.75,  1.75], [0,     0, 0], {U: colorscheme.U, F: colorscheme.F, R: colorscheme.R}],
            UFL: [[-1.75,  1.75,  1.75], [0,  -pi2, 0], {U: colorscheme.U, F: colorscheme.L, R: colorscheme.F}],
            DBL: [[-1.75, -1.75, -1.75], [pi, -pi2, 0], {U: colorscheme.D, F: colorscheme.L, R: colorscheme.B}],
            DBR: [[ 1.75, -1.75, -1.75], [pi,    0, 0], {U: colorscheme.D, F: colorscheme.B, R: colorscheme.R}],
            DFR: [[ 1.75, -1.75,  1.75], [pi,  pi2, 0], {U: colorscheme.D, F: colorscheme.R, R: colorscheme.F}],
            DFL: [[-1.75, -1.75,  1.75], [pi,   pi, 0], {U: colorscheme.D, F: colorscheme.F, R: colorscheme.L}]
        };
        for(var i in corners) {
            var piece = factory.create(corners[i][0], corners[i][1], corners[i][2]);
            self.rendermgr.meshs.push(piece.movable.mesh);
            self.pieces[i] = piece;
        }
    })();

    // ----- Edges -----

    (function() {
        var s = 1.5/Math.sqrt(2)-0.5;
        var mesh = self.rendermgr.renderer.createMesh();
        if(self.options.minimal) {
            mesh.vertexBuffer.feed([]);
            mesh.indexBuffer.feed([]);
            var colors = [];
        } else {
            mesh.vertexBuffer.feed([
                -0.75,  0.5,  0.5,
                -0.75,  0.5,   -s,
                -0.75,   -s,  0.5,
                -0.75, -0.5, -s-1,
                -0.75, -s-1, -0.5,
                 0.75,  0.5,  0.5,
                 0.75,  0.5,   -s,
                 0.75,   -s,  0.5,
                 0.75, -0.5, -s-1,
                 0.75, -s-1, -0.5,
            ]);

            mesh.indexBuffer.feed([
                0, 1, 2,
                1, 3, 4, 1, 4, 2,
                5, 7, 6,
                6, 9, 8, 6, 7, 9,
                5, 6, 1, 5, 1, 0,
                7, 5, 0, 7, 0, 2,
                6, 8, 3, 6, 3, 1,
                7, 2, 4, 7, 4, 9,
                4, 3, 8, 4, 8, 9
            ]);

            var colors = ["p", "p", "p", "p", "p", "p", "p", "p", "p", "p"];
        }

        var stickerGenerator = function(margin, distance) {
            var stickerZ = 0.5 + distance;
            var stickerX = 0.75 - margin;
            var stickerY1 = s - margin;
            var stickerY2 = 0.5 - margin;
            colors = colors.concat([
                "U", "U", "U", "U",
                "F", "F", "F", "F",
            ]);

            return {
                vertex: [
                    // U
                    -stickerX,  stickerZ,  -stickerY1,
                    -stickerX,  stickerZ,   stickerY2,
                     stickerX,  stickerZ,   stickerY2,
                     stickerX,  stickerZ,  -stickerY1,
                    // F
                    -stickerX, -stickerY1,  stickerZ,
                     stickerX, -stickerY1,  stickerZ,
                     stickerX,  stickerY2,  stickerZ,
                    -stickerX,  stickerY2,  stickerZ,
                ],
                index: [
                    0, 1, 2,      0, 2, 3,    // U
                    4, 5, 6,      4, 6, 7,    // F
                ]
            };
        };

        var defaultColors = {
            p: self.options.plasticColor,
            F: [0.5, 0.5, 0.5, 1.0],
            U: [0.5, 0.5, 0.5, 1.0],
        };


        var stickerCreator = new Rubikjs.Render.StickerHelper(stickerGenerator);
        stickerCreator.create(mesh, self.options.stickerMargin, self.options.stickerDist, false);

        if(self.options.backStickerEnabled) {
            stickerCreator.create(mesh, self.options.backStickerMargin, self.options.backStickerDist, true);
        }

        var factory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, mesh, colors, defaultColors);

        var edges = {
            UB: [[ 0,     2.25, -2.25], [0,   pi,    0], {U: colorscheme.U, F: colorscheme.B}],
            UR: [[ 2.25,  2.25,  0   ], [0,  pi2,    0], {U: colorscheme.U, F: colorscheme.R}],
            UF: [[ 0,     2.25,  2.25], [0,    0,    0], {U: colorscheme.U, F: colorscheme.F}],
            UL: [[-2.25,  2.25,  0   ], [0, -pi2,    0], {U: colorscheme.U, F: colorscheme.L}],
            FL: [[-2.25,  0,     2.25], [0,    0,  pi2], {U: colorscheme.L, F: colorscheme.F}],
            FR: [[ 2.25,  0,     2.25], [0,    0, -pi2], {U: colorscheme.R, F: colorscheme.F}],
            BR: [[ 2.25,  0,    -2.25], [0,   pi,  pi2], {U: colorscheme.R, F: colorscheme.B}],
            BL: [[-2.25,  0,    -2.25], [0,   pi, -pi2], {U: colorscheme.L, F: colorscheme.B}],
            DF: [[ 0,    -2.25,  2.25], [0,    0,   pi], {U: colorscheme.D, F: colorscheme.F}],
            DR: [[ 2.25, -2.25,  0   ], [0,  pi2,   pi], {U: colorscheme.D, F: colorscheme.R}],
            DB: [[ 0,    -2.25, -2.25], [0,   pi,   pi], {U: colorscheme.D, F: colorscheme.B}],
            DL: [[-2.25, -2.25,  0   ], [0, -pi2,   pi], {U: colorscheme.D, F: colorscheme.L}]
        };

        for(var i in edges) {
            var piece = factory.create(edges[i][0], edges[i][1], edges[i][2]);
            self.rendermgr.meshs.push(piece.movable.mesh);
            self.pieces[i] = piece;
        }
    })();


    // ----- Centers -----

    var self = this;
    (function() {
        var mesh = self.rendermgr.renderer.createMesh();
        if(self.options.minimal) {
            mesh.vertexBuffer.feed([]);
            mesh.indexBuffer.feed([]);
            var colors = [];
        } else {
            mesh.vertexBuffer.feed([
                -0.75, -0.75, -0.75,
                -0.75, -0.75,  0.75,
                -0.75,  0.75, -0.75,
                -0.75,  0.75,  0.75,
                 0.75, -0.75, -0.75,
                 0.75, -0.75,  0.75,
                 0.75,  0.75, -0.75,
                 0.75,  0.75,  0.75,
            ]);

            mesh.indexBuffer.feed([
                1, 5, 7,    1, 7, 3, // F
                0, 2, 6,    0, 6, 4, // B
                2, 3, 7,    2, 7, 6, // U
                0, 4, 5,    0, 5, 1, // D
                4, 6, 7,    4, 7, 5, // R
                0, 1, 3,    0, 3, 2  // L
            ]);

            var colors = ["p", "p", "p", "p", "p", "p", "p", "p"];
        }

        var stickerGenerator = function(margin, distance) {
            var stickerZ = 0.75 + distance;
            var stickerXY = 0.75 - margin;
            colors = colors.concat([
                "U", "U", "U", "U",
            ]);

            return {
                vertex: [
                    // U
                    -stickerXY,  stickerZ,  -stickerXY,
                    -stickerXY,  stickerZ,   stickerXY,
                     stickerXY,  stickerZ,   stickerXY,
                     stickerXY,  stickerZ,  -stickerXY,
                ],
                index: [
                    0, 1, 2,      0, 2, 3,    // U
                ]
            };
        };

        var defaultColors = {
            p: self.options.plasticColor,
            U: [0.5, 0.5, 0.5, 1.0],
        };


        var stickerCreator = new Rubikjs.Render.StickerHelper(stickerGenerator);
        stickerCreator.create(mesh, self.options.stickerMargin, self.options.stickerDist, false);

        if(self.options.backStickerEnabled) {
            stickerCreator.create(mesh, self.options.backStickerMargin, self.options.backStickerDist, true);
        }

        var factory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, mesh, colors, defaultColors);
        var centers = {
            U: [[ 0,  2,  0], [0,    0,    0], {U: colorscheme.U}],
            L: [[-2,  0,  0], [0,    0,  pi2], {U: colorscheme.L}],
            F: [[ 0,  0,  2], [pi2,  0,    0], {U: colorscheme.F}],
            R: [[ 2,  0,  0], [0,    0, -pi2], {U: colorscheme.R}],
            B: [[ 0,  0, -2], [-pi2, 0,    0], {U: colorscheme.B}],
            D: [[ 0, -2,  0], [pi,   0,    0], {U: colorscheme.D}]
        };

        for(var i in centers) {
            var piece = factory.create(centers[i][0], centers[i][1], centers[i][2]);
            self.rendermgr.meshs.push(piece.movable.mesh);
            self.pieces[i] = piece;
        }
    })();

    // ----- Inner edges -----

    (function() {
        var s = 2-(1.5/Math.sqrt(2));
        var mesh = self.rendermgr.renderer.createMesh();
        if(self.options.minimal) {
            mesh.vertexBuffer.feed([]);
            mesh.indexBuffer.feed([]);
            var colors = [];
        } else {
            mesh.vertexBuffer.feed([
                -0.75,  0, 0,
                -0.75, -s, 0,
                -0.75,  0, s,
                 0.75,  0, 0,
                 0.75, -s, 0,
                 0.75,  0, s
            ]);

            mesh.indexBuffer.feed([
                0, 1, 2,
                3, 5, 4,
                0, 2, 5, 0, 5, 3,
                1, 0, 3, 1, 3, 4,
                2, 1, 4, 2, 4, 5
            ]);

            var colors = ["p", "p", "p", "p", "p", "p"];
        }

        var stickerGenerator = function(margin, distance) {
            var stickerZ = distance;
            var stickerX = 0.75 - margin;
            var stickerY1 = margin;
            var stickerY2 = s - margin;
            colors = colors.concat([
                "U", "U", "U", "U",
            ]);

            return {
                vertex: [
                    // U
                    -stickerX,  stickerZ,   stickerY1,
                    -stickerX,  stickerZ,   stickerY2,
                     stickerX,  stickerZ,   stickerY2,
                     stickerX,  stickerZ,   stickerY1
                ],
                index: [
                    0, 1, 2,      0, 2, 3,    // U
                ]
            };
        };

        var defaultColors = {
            p: self.options.plasticColor,
            U: [0.5, 0.5, 0.5, 1.0],
        };


        var stickerCreator = new Rubikjs.Render.StickerHelper(stickerGenerator);
        stickerCreator.create(mesh, self.options.stickerMargin, self.options.stickerDist, false);

        if(self.options.backStickerEnabled) {
            stickerCreator.create(mesh, self.options.backStickerMargin, self.options.backStickerDist, true);
        }

        var factory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, mesh, colors, defaultColors);

        var edges = {
            ub: [[ 0,     2.75, -0.75], [ 0,     pi,    0], {U: colorscheme.U}],
            ur: [[ 0.75,  2.75,  0   ], [ 0,    pi2,    0], {U: colorscheme.U}],
            uf: [[ 0,     2.75,  0.75], [ 0,      0,    0], {U: colorscheme.U}],
            ul: [[-0.75,  2.75,  0   ], [ 0,   -pi2,    0], {U: colorscheme.U}],
            df: [[ 0,    -2.75,  0.75], [ 0,      0,   pi], {U: colorscheme.D}],
            dr: [[ 0.75, -2.75,  0   ], [ 0,    pi2,   pi], {U: colorscheme.D}],
            db: [[ 0,    -2.75, -0.75], [ 0,     pi,   pi], {U: colorscheme.D}],
            dl: [[-0.75, -2.75,  0   ], [ 0,   -pi2,   pi], {U: colorscheme.D}],
            fl: [[-0.75,  0,     2.75], [ pi2, -pi2,    0], {U: colorscheme.F}],
            fr: [[ 0.75,  0,     2.75], [ pi2,  pi2,    0], {U: colorscheme.F}],
            fu: [[ 0,     0.75,  2.75], [ pi2,   pi,    0], {U: colorscheme.F}],
            fd: [[ 0,    -0.75,  2.75], [ pi2,    0,    0], {U: colorscheme.F}],
            bl: [[-0.75,  0,    -2.75], [ pi2, -pi2,   pi], {U: colorscheme.B}],
            br: [[ 0.75,  0,    -2.75], [ pi2,  pi2,   pi], {U: colorscheme.B}],
            bu: [[ 0,     0.75, -2.75], [ pi2,   pi,   pi], {U: colorscheme.B}],
            bd: [[ 0,    -0.75, -2.75], [ pi2,    0,   pi], {U: colorscheme.B}],
            rf: [[ 2.75,  0,     0.75], [ 0,      0, -pi2], {U: colorscheme.R}],
            rb: [[ 2.75,  0,    -0.75], [ 0,     pi,  pi2], {U: colorscheme.R}],
            ru: [[ 2.75,  0.75,  0   ], [-pi2,    0, -pi2], {U: colorscheme.R}],
            rd: [[ 2.75, -0.75,  0   ], [-pi2,   pi,  pi2], {U: colorscheme.R}],
            lf: [[-2.75,  0,     0.75], [ 0,      0,  pi2], {U: colorscheme.L}],
            lb: [[-2.75,  0,    -0.75], [ 0,     pi, -pi2], {U: colorscheme.L}],
            lu: [[-2.75,  0.75,  0   ], [-pi2,    0,  pi2], {U: colorscheme.L}],
            ld: [[-2.75, -0.75,  0   ], [-pi2,   pi, -pi2], {U: colorscheme.L}]
        };

        for(var i in edges) {
            var piece = factory.create(edges[i][0], edges[i][1], edges[i][2]);
            self.rendermgr.meshs.push(piece.movable.mesh);
            self.pieces[i] = piece;
        }
    })();
};
