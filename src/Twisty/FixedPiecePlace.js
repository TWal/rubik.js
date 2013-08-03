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


//Use this class if you want to simulate a doctrinaire puzzle, or a shape-mod of a doctrinaire puzzle.
//A puzzle is doctrinaire, if when we remove the stickers, the puzzle remain the same after each turn

//For example: The classic Rubik's cube is doctrinaire, and the fisher cube is a shape-mod of the classic Rubik's cube, so you should use this class for both.
//Some puzzles like the mixup cube can be considered as a shape-mod of a doctrinaire puzzle, you should use this class for them.

//There is a common thing for each of these puzzle: Each piece has a place, and each place of the puzzle has a piece in it.

//Examples: Should go here: N*N*N, fisher cube, X*Y*Z (half turn only), Mixup Cube, Megaminx, Skewb, Pyraminx, Square-2
//          Should NOT go here: Curvy-copter
//          Bandaged puzzles should NOT go here too: Square-1 (it's a square-2 bandaged), bandaged cube, 4*4*6 (it's a 6*6*6 bandaged)
Rubikjs.Twisty.FixedPiecePlace = function() {
    //These variables are here only to understand easilier the rest of the code. You must override them
    this.pieces = {};
    this.groups = {};
    this.turnDegree = 90;
    this.turnTime = 0.5;
    this.stepNumber = 10;
    this.instructionQueue = [];
    this.isProcessingQueue = false;
    this.rendermgr = null;
};

Rubikjs.Twisty.FixedPiecePlace.prototype.makeOptions = function(defaultOptions, options, cubeSize) {
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -2]);
    mat4.rotateX(cameraMatrix, cameraMatrix, Math.PI/6);
    mat4.rotateY(cameraMatrix, cameraMatrix, -Math.PI/6);
    var invSize = 1.0 / cubeSize;
    mat4.scale(cameraMatrix, cameraMatrix, [invSize, invSize, invSize]);
    var defaultDefaultOptions = {
        plasticColor: [0.0, 0.0, 0.0, 1.0],
        minimal: Rubikjs.Render.Canvas.Renderer != undefined && this.rendermgr.renderer instanceof Rubikjs.Render.Canvas.Renderer,
        backStickerEnabled: false,
        backStickerDistance: cubeSize*0.3,
        cameraMatrix: cameraMatrix
    };
    this.options = Rubikjs.Core.Utils.makeOptions(Rubikjs.Core.Utils.makeOptions(defaultDefaultOptions, defaultOptions), options);
};

Rubikjs.Twisty.FixedPiecePlace.prototype.endInit = function() {
    this.rendermgr.transformCamera(this.options.cameraMatrix);
    var self = this;
    for(var i in this.groups) {
        if(this.groups[i] instanceof Rubikjs.Twisty.FixedPiecePlace.Group) {
            this.groups[i].pieces = this.groups[i].pieces.map(function(piecesId) {
                return piecesId.map(function(pieceId) {
                    //If when we have two names for one group, it will be mapped two times, and his pieces will be undefined
                    if(pieceId instanceof Rubikjs.Twisty.FixedPiecePlace.Piece) {
                        return pieceId;
                    }
                    return self.pieces[pieceId];
                });
            });
        }
    }
    this.rendermgr.render();
};

Rubikjs.Twisty.FixedPiecePlace.prototype.sendInstruction = function(instruction) {
    this.instructionQueue.push(instruction);
    this.processQueue();
};


Rubikjs.Twisty.FixedPiecePlace.prototype.sendMultipleInstructions = function(instructions) {
    this.instructionQueue = this.instructionQueue.concat(instructions);
    this.processQueue();
};

Rubikjs.Twisty.FixedPiecePlace.prototype.stop = function() {
    this.instructionQueue = [];
};

Rubikjs.Twisty.FixedPiecePlace.prototype.processQueue = function() {
    if(this.isProcessingQueue) {
        return;
    } else if(this.instructionQueue.length == 0) {
        this.isProcessingQueue = false;
        return;
    }
    this.isProcessingQueue = true;

    var instruction = this.instructionQueue[0];

    var self = this;
    var finishFunction = function() {
        self.instructionQueue.shift();
        self.isProcessingQueue = false;
        self.processQueue();
    };

    if(instruction instanceof Rubikjs.Notation.Move) {
        this.multipleMove(this.stepNumber, [instruction.group.getTurnFunction(instruction.count, this.stepNumber)], finishFunction);
    } else if(instruction instanceof Rubikjs.Notation.MultiMove) {
        this.multipleMove(this.stepNumber, instruction.moves.map(function(move) {
            return move.group.getTurnFunction(move.count * instruction.count, this.stepNumber);
        }, this), finishFunction);
    } else {
        finishFunction();
    }
};

Rubikjs.Twisty.FixedPiecePlace.prototype.multipleMove = function(stepNumber, moveFunctions, callback) {
    //TODO: Better fps management
    var i = 0;
    var self = this;
    var loopFunction = function() {
        if(i < stepNumber) {
            if(moveFunctions.length == 1) {
                moveFunctions[0].turnFunction();
            } else {
                var j = moveFunctions.length;
                while(j--) {
                    moveFunctions[j].nbTurnFunction(-i);
                }
                for(j = 0; j < moveFunctions.length; ++j) {
                    moveFunctions[j].nbTurnFunction(i + 1);
                }
            }

            i += 1;
            setTimeout(loopFunction, self.turnTime / stepNumber * 1000);
            self.rendermgr.render();
        } else {
            moveFunctions.forEach(function(moveFunc) {
                moveFunc.endFunction();
            });

            callback();
        }
    };

    loopFunction();
};





Rubikjs.Twisty.FixedPiecePlace.Piece = function(mesh) {
    this.movable = {
        mesh: mesh
    };
};




Rubikjs.Twisty.FixedPiecePlace.Group = function(twisty, options) {
    this.twisty = twisty;
    Rubikjs.Core.Utils.makeOptions({
        pieces: [], //This is an array of array of pieces
        rotationAxis: [0, 1, 0],
        rotationCenter: [0, 0, 0],
        turnDegree: this.twisty.turnDegree
    }, options, this);
};

Rubikjs.Twisty.FixedPiecePlace.Group.prototype.cycle = function(count) {
    for(var i = 0; i < this.pieces.length; ++i) {
        //Why this? Check out this example:
        /* var toto = this.pieces[0];
         * var tata = toto;
         * tata.movable = this.pieces[1].movable;
         */
        //Attention, you changed toto.movable!
        //That's why we do this
        var movableCopy = this.pieces[i].map(function(x) {
            return x.movable;
        });
        var piecesNb = this.pieces[i].length;
        var positiveCount = (count % piecesNb) + piecesNb; //When count is negative, the index we give won't be negative
        for(var j = 0; j < piecesNb; ++j) {
            this.pieces[i][j].movable = movableCopy[(j + positiveCount) % piecesNb];
        }
    }
};

Rubikjs.Twisty.FixedPiecePlace.Group.prototype.getTurnFunction = function(count, stepNumber) {
    count = -count; //Clockwise -> trigonometric
    var stepAngle = ((this.turnDegree * Math.PI / 180) * count) / stepNumber;
    var self = this;
    var rotationMat = mat4.create();
    mat4.rotate(rotationMat, rotationMat, stepAngle, self.rotationAxis);


    return {
        turnFunction: function() {
            self.pieces.forEach(function(pieces) {
                pieces.forEach(function(piece) {
                    mat4.multiply(piece.movable.mesh.transform, rotationMat, piece.movable.mesh.transform);
                });
            });
        },
        nbTurnFunction: function(nb) {
            var rotationMatrix = mat4.create();
            mat4.rotate(rotationMatrix, rotationMatrix, nb*stepAngle, self.rotationAxis);
            self.pieces.forEach(function(pieces) {
                pieces.forEach(function(piece) {
                    mat4.multiply(piece.movable.mesh.transform, rotationMatrix, piece.movable.mesh.transform);
                });
            });
        },
        endFunction: function() {
            self.cycle(count);
        }
    };
};






/* Be *very* careful with this class !
 * Let n be the number of full rotations to return to the first state
 * Let m such that m < n
 * If a group is at the same place after m full rotations, there can be a *nasty bug*.
 *
 * For example, in the classic rubik's cube (3^3), n=4 and m=2
 * When you to Z2, for example, the M slice is at the same place as it was before Z2
 * When you'll use the M slice after Z2, the pieces will cycle in the wrong direction
 * Then, when you will do U, D, F, or B, the pieces will overlap and your cube will be bugged
 *
 * If you run in a such case while creating your own cube, you can use FixedPiecePlace.Combined, to do multiple moves at the same time
 * For example, in the classic Rubik's cube, "X" will be a combination of R, M', and L'
 */

Rubikjs.Twisty.FixedPiecePlace.FullRotation = function(twisty, options) {
    this.twisty = twisty;
    Rubikjs.Core.Utils.makeOptions({
        groups: [], //This is an array of array of groups
        rotationAxis: [0, 1, 0],
        rotationCenter: [0, 0, 0],
        turnDegree: this.twisty.turnDegree
    }, options, this);
};

Rubikjs.Twisty.FixedPiecePlace.FullRotation.prototype.cycle = function(count) {
    for(var i = 0; i < this.groups.length; ++i) {
        var groupsPieces = {};
        for (var key in this.twisty.groups) {
            if(this.twisty.groups.hasOwnProperty(key)) {
                groupsPieces[key] = this.twisty.groups[key].pieces;
            }
        }

        var groupNb = this.groups[i].length;
        var positiveCount = (count % groupNb) + groupNb;

        for(var j = 0; j < groupNb; ++j) {
            this.twisty.groups[this.groups[i][j]].pieces = groupsPieces[this.groups[i][(j + positiveCount) % groupNb]];
        }
    }
};

Rubikjs.Twisty.FixedPiecePlace.FullRotation.prototype.getTurnFunction = function(count, stepNumber) {
    count = -count; //Clockwise -> trigonometric
    var stepAngle = ((this.turnDegree * Math.PI / 180) * count) / stepNumber;
    var self = this;
    var rotationMat = mat4.create();
    mat4.rotate(rotationMat, rotationMat, stepAngle, self.rotationAxis);


    return {
        turnFunction: function() {
            for(var key in self.twisty.pieces) {
                mat4.multiply(self.twisty.pieces[key].movable.mesh.transform, rotationMat, self.twisty.pieces[key].movable.mesh.transform);
            }
        },
        nbTurnFunction: function(nb) {
            var rotationMatrix = mat4.create();
            mat4.rotate(rotationMatrix, rotationMatrix, nb*stepAngle, self.rotationAxis);
            for(var key in self.twisty.pieces) {
                mat4.multiply(self.twisty.pieces[key].movable.mesh.transform, rotationMatrix, self.twisty.pieces[key].movable.mesh.transform);
            }
        },
        endFunction: function() {
            self.cycle(count);
        }
    };
};





Rubikjs.Twisty.FixedPiecePlace.Combined = function(twisty, groups) {
    this.twisty = twisty;
    this.groups = groups; //groups has the following form: [[group, count], [group, count], [group, count], ...]
};

Rubikjs.Twisty.FixedPiecePlace.Combined.prototype.getTurnFunction = function(count, stepNumber) {
    var turnFunctions = [];

    for (var i = 0; i < this.groups.length; ++i) {
        turnFunctions.push(this.twisty.groups[this.groups[i][0]].getTurnFunction(count * this.groups[i][1], stepNumber));
    }

    return {
        turnFunction: function() {
            for(var i = 0; i < turnFunctions.length; ++i) {
                turnFunctions[i].turnFunction();
            }
        },
        nbTurnFunction: function(nb) {
            for(var i = 0; i < turnFunctions.length; ++i) {
                turnFunctions[i].nbTurnFunction(nb);
            }
        },
        endFunction: function() {
            for(var i = 0; i < turnFunctions.length; ++i) {
                turnFunctions[i].endFunction();
            }
        }
    }
};

Rubikjs.Twisty.FixedPiecePlace.DefaultNotation = function(twisty) {
    this.twisty = twisty;
};

Rubikjs.Twisty.FixedPiecePlace.DefaultNotation.prototype = new Rubikjs.Notation.Parser;
Rubikjs.Twisty.FixedPiecePlace.DefaultNotation.prototype.constructor = new Rubikjs.Twisty.FixedPiecePlace.DefaultNotation;


Rubikjs.Twisty.FixedPiecePlace.DefaultNotation.prototype.parseToken = function(token) {
    var groupLength = this.groupNameLength(token);
    var group = token.substr(0, groupLength);

    var count = this.getCount(token.substr(groupLength));

    if(this.twisty.groups[group] != undefined) {
        return new Rubikjs.Notation.Move(this.twisty.groups[group], count);
    } else {
        Rubikjs.Core.Logger.log("Twisty", "Undefined group name: '" + group + "'", "warn");
        return new Rubikjs.Notation.Instruction();
    }
};
