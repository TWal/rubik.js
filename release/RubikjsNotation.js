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
};

Rubikjs.Notation.Parser.prototype.parse = function(formula) {
    var splitted = formula.split(this.separator);
    var self = this;
    var result = [];
    for(var i = 0; i < splitted.length; ++i) {
        if(splitted[i] != "") {
            result.push(self.parseToken(splitted[i]));
        }
    }
    return result;
};

Rubikjs.Notation.Parser.prototype.parseToken = function(token) {
    return new Rubikjs.Notation.Instruction;
};

