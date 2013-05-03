Rubik.js
========

Rubik.js is a javascript library to render and simulate twisty puzzles (commonly know as Rubik's Cube).

Renderers
---------

Rubik.js only support WebGL and Canvas for the moment (see todo-list for more).

Puzzle support
--------------

I would like rubik.js to support almost all twisty puzzle, like Rubik's Cube, Rubik's Revenge, V-Cube-7, Skweb, Megaminx, Square-One, and so on. I won't support helicopter and gear puzzles, to begin, because they seem to hard to implement.

Wanted features
---------------

* Support of almost any twisty puzzle
* WebGL, Canvas, and SVG support
* Mouse control (camera rotation and puzzle turning)
* User-defined sticker color (=> grey sticker)
* An ergonomic user interface

How to use the makefile
-----------------------

Do `make` to create one file per module, in the release directory, with "use strict";
Do `make min` to do the same thing as `make`, and minify the source code with closure.
Do `make watch` to do `make` when a file is changed (Linux only, it uses inotify)

Don't forget to use `-j` to speed up things! Example: `make min -j8`

Want to see rubik.js's power?
-----------------------------

See here! --> http://htmlpreview.github.com/?http://github.com/TWal/rubik.js/blob/master/index.html
