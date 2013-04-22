"use strict";

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

//Just a class so we have a nice inheritance
Rubikjs.Notation.Instruction = function() {
};

Rubikjs.Notation.Instruction.prototype.copy = function() {
    return new Rubikjs.Notation.Instruction();
};
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

Rubikjs.Notation.Move = function(group, count) {
    this.group = group;
    this.count = count;
};

Rubikjs.Notation.Move.prototype = new Rubikjs.Notation.Instruction;
Rubikjs.Notation.Move.prototype.constructor = new Rubikjs.Notation.Move;

Rubikjs.Notation.Move.prototype.copy = function() {
    return new Rubikjs.Notation.Move(this.group, this.count);
};
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

Rubikjs.Notation.MultiMove = function(moves, count) {
    this.moves = moves;
    this.count = count;
};

Rubikjs.Notation.MultiMove.prototype = new Rubikjs.Notation.Instruction;
Rubikjs.Notation.MultiMove.prototype.constructor = new Rubikjs.Notation.MultiMove;

Rubikjs.Notation.MultiMove.prototype.copy = function() {
    var newMoves = [];
    for(var i = 0; i < this.moves.length; ++i) {
        newMoves.push(this.moves[i].copy());
    }
    return new Rubikjs.Notation.MultiMove(newMoves, this.count);
};
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

Rubikjs.Notation.Parser = function() {
    this.separator = " ";
    this.handleParenthesis = true;
    this.handleCombined = true;
    this.handleCommutators = true; //And conjugates too. But this.handleCommutatorsAndConjugates is a little bit long.
};

//Can parse complicated formulas like "([[x': [[R: U'], D] [[R: U], D]], U] [M2' U': [M2', U2]] {D2 U2})2"
Rubikjs.Notation.Parser.prototype.parse = function(formula) {
    var splitted = this.roughSplit(formula);
    if(splitted[0] == formula) {
        if(formula[0] == "(") {
            var matchingPar = formula.lastIndexOf(")");
            return this.multiplyInstuctions(this.parse(formula.substring(1, matchingPar)), this.getCount(formula.substring(matchingPar + 1)));
        } else if(formula[0] == "{") {
            var matchingBrace = formula.lastIndexOf("}");
            return [this.combineInstructions(this.parse(formula.substring(1, matchingBrace)), this.getCount(formula.substring(matchingBrace + 1)))];
        } else if(formula[0] == "[") {
            var matchingBracket = formula.lastIndexOf("]");
            var matchingComma = this.findMatching(formula, "[", "]", ",");
            var matchingColon = this.findMatching(formula, "[", "]", ":");
            if(matchingComma != -1) {
                return this.multiplyInstuctions(this.commutateInstructions(this.parse(formula.substring(1, matchingComma)), this.parse(formula.substring(matchingComma + 1, matchingBracket))), this.getCount(formula.substring(matchingBracket + 1)));
            } else if(matchingColon != -1) {
                return this.multiplyInstuctions(this.conjugateInstructions(this.parse(formula.substring(1, matchingColon)), this.parse(formula.substring(matchingColon + 1, matchingBracket))), this.getCount(formula.substring(matchingBracket + 1)));
            } else {
                return [];
            }
        } else {
            return this.simpleParse(splitted[0]);
        }
    } else {
        return splitted.map(this.parse, this).reduce(function(a, b) {
            return a.concat(b);
        });
    }
};

//Can parse simple formulas like "R U R' U'"
Rubikjs.Notation.Parser.prototype.simpleParse = function(formula) {
    var splitted = formula.split(this.separator);
    var result = [];
    for(var i = 0; i < splitted.length; ++i) {
        if(splitted[i] != "") {
            result.push(this.parseToken(splitted[i]));
        }
    }
    return result;
};

//Split roughly a formula. It will transform a formula like "[R, U] [R', F] [F [R: U']: U']" to ["[R, U]", "[R', F]", "[F [R: U']: U']"]
Rubikjs.Notation.Parser.prototype.roughSplit = function(formula) {
    if(formula == "") {
        return [];
    }

    if(this.handleParenthesis && !this.occurencesEqual(formula, "(", ")")) {
        return [];
    }

    if(this.handleCombined && !this.occurencesEqual(formula, "{", "}")) {
        return [];
    }

    if(this.handleCommutators && !this.occurencesEqual(formula, "[", "]")) {
        return [];
    }

    if(this.handleParenthesis && formula[0] == "(") {
        var matching = this.findMatching(formula, "(", ")");
        var matchingSeparator = formula.indexOf(this.separator, matching);
        if(matchingSeparator != -1) {
            var splitTo = matchingSeparator;
        } else {
            var splitTo = formula.length;
        }
        return [formula.substring(0, splitTo)].concat(this.roughSplit(formula.substring(splitTo)));
    }

    if(this.handleCombined && formula[0] == "{") {
        var matching = this.findMatching(formula, "{", "}");
        var matchingSeparator = formula.indexOf(this.separator, matching);
        if(matchingSeparator != -1) {
            var splitTo = matchingSeparator;
        } else {
            var splitTo = formula.length;
        }
        return [formula.substring(0, splitTo)].concat(this.roughSplit(formula.substring(splitTo)));
    }

    if(this.handleCommutators && formula[0] == "[") {
        var matching = this.findMatching(formula, "[", "]");
        var matchingSeparator = formula.indexOf(this.separator, matching);
        if(matchingSeparator != -1) {
            var splitTo = matchingSeparator;
        } else {
            var splitTo = formula.length;
        }
        return [formula.substring(0, splitTo)].concat(this.roughSplit(formula.substring(splitTo)));
    }

    var splitTo = formula.length;
    if(this.handleParenthesis) {
        var firstPar = formula.indexOf("(");
        if(firstPar != -1 && firstPar < splitTo) {
            splitTo = firstPar;
        }
    }

    if(this.handleCombined) {
        var firstBrace = formula.indexOf("{");
        if(firstBrace != -1 && firstBrace < splitTo) {
            splitTo = firstBrace;
        }
    }

    if(this.handleCommutators) {
        var firstBrace = formula.indexOf("[");
        if(firstBrace != -1 && firstBrace < splitTo) {
            splitTo = firstBrace;
        }
    }

    return [formula.substring(0, splitTo)].concat(this.roughSplit(formula.substring(splitTo)));
};

Rubikjs.Notation.Parser.prototype.findMatching = function(str, open, close, find) {
    find = find || close;
    var i = 0;
    var depth = 1;
    while(true) {
        ++i;
        if(depth == 1 && str[i] == find) {
            return i;
        }

        if(str[i] == open) {
            depth += 1;
        } else if(str[i] == close) {
            depth -= 1;
        }

        if(i >= str.length) {
            return -1;
        }
    }
};

Rubikjs.Notation.Parser.prototype.occurencesEqual = function(str, open, close) {
    var openNb = 0;
    var closeNb = 0;

    for(var i = 0; i < str.length; ++i) {
        if(str[i] == open) {
            ++openNb;
        } else if(str[i] == close) {
            ++closeNb;
        }
    }

    return openNb == closeNb;
};

Rubikjs.Notation.Parser.prototype.multiplyInstuctions = function(instructions, count) {
    if(count < 0) {
        instructions.reverse();
        for(var i = 0; i < instructions.length; ++i) {
            instructions[i].count = -instructions[i].count;
        }
        count = -count;
    }

    var result = [];
    for(var i = 0; i < count; ++i) {
        result = result.concat(instructions);
    }

    return result;
};

Rubikjs.Notation.Parser.prototype.combineInstructions = function(instructions, count) {
    return new Rubikjs.Notation.MultiMove(instructions, count);
};

Rubikjs.Notation.Parser.prototype.commutateInstructions = function(instructions1, instructions2) {
    var result = instructions1.concat(instructions2);

    var i = instructions1.length;
    while(i--) {
        var newInstruction = instructions1[i].copy();
        newInstruction.count = -newInstruction.count;
        result.push(newInstruction);
    }

    i = instructions2.length;
    while(i--) {
        var newInstruction = instructions2[i].copy();
        newInstruction.count = -newInstruction.count;
        result.push(newInstruction);
    }

    return result;
};

Rubikjs.Notation.Parser.prototype.conjugateInstructions = function(instructions1, instructions2) {
    var result = instructions1.concat(instructions2);

    var i = instructions1.length;
    while(i--) {
        var newInstruction = instructions1[i].copy();
        newInstruction.count = -newInstruction.count;
        result.push(newInstruction);
    }

    return result;
};

Rubikjs.Notation.Parser.prototype.getCount = function(str) {
    //Special cases
    if(str == "") {
        return 1;
    } else if(str == "'") {
        return -1;
    } else {
        var count = parseInt(str);
        if(str[str.length - 1] == "'") {
            return -count;
        } else {
            return count;
        }
    }
};

Rubikjs.Notation.Parser.prototype.parseToken = function(token) {
    return new Rubikjs.Notation.Instruction;
};

