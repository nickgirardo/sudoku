Sudoku Player
=============

A Sudoku Player where puzzles are described in the page's query string

A bare-bones Sudoku Builder which can output links to pages with query strings the player expects

Check it out live <https://nickgirardo.com/projects/sudoku/player.html>

Building, Running, and Testing
------------------------------

The player can be ran locally with `npm run start:player`, the viewer can be ran locally `npm run start:builder`.  Unfortunately, there is no way to run both simultaneously with the dev server currently.

The build command `npm run build` does build both the player and builder.  If you want to test them together you can build them and then serve the `./build` directory with a static html server of your choice.  Unfortunately, this is awkward for development as hot-reloading is not supported with this approach.

Tests can be run with the command `npm run test`.  Currently, the tests cover the encoder and decoder as well as the Sudoku solver which is used by the builder to determine whether a puzzle is valid.  These are by far the most complex and fragile parts of the application.

About the Player
----------------

The Sudoku player can play games which are encoded as base64 strings in the query string.

For example, you can see the puzzle stored in the `play` key here <https://nickgirardo.com/projects/sudoku/player.html?play=UyF2MQRhyECJQWIySCkiKoXU+yAUcJiTwoVTKoVqsHYm5V3D54DxCitHWQclJ0g=>.  If you attempt to decode the query string UyF2MQRhyECJQWIySCkiKoXU+yAUcJiTwoVTKoVqsHYm5V3D54DxCitHWQclJ0g= you can see the (UTF-8) output is a fairly garbled string:

> S!v1\<04\>a@Ab2H)"\* \<14\>p\<85\>S\*jv&]
> +GY\<07\>%'H

Characters within angle-brackets would not be displayed correctly.

While it is difficult to make much of this, the `S!v1` at the start can be read in this format. `S!` is just a magic string, and `v1` is the version string for this puzzle.  Versioning the decoding allows for using more compact formats or adding features in the future.  The rest of the string is binary encoded.  Also, be aware that some query string parsers (such as the browser's `URLSearchParams`) may transform the character `+` into a space.  This will cause the decoding to be corrupted.  However, as base64 encoded strings never naturally contain spaces you can simply replace all spaces into `+` to get the original param.  The specifics of decoding the binary part `v1` puzzles (like the one examined here) will be described in the section "Encoding and Decoding v1 Puzzles."

Why should we bother with storing puzzles in the query string?  To answer this let's compare this method to the alternative.  The common way you might build a web app like this is to have an id per puzzle and use that id in an API request to return the puzzle. For instance, you might navigate to <https://example.com/sudoku/654321>, and the page would make an API request to <https://example.com/api/sudoku?id=654321>.  This can return arbitrary JSON to describe the Sudoku puzzle.

This approach has some downsides.  For one, it requires an extra request.  This can be mitigated by rendering the page statically before sending it down the wire.  However, even without the extra request more work is required for by the server.  If the puzzle is described as a query string the client can parse any puzzle from the same document.  This means only a static server with a single bundle is required instead of a server with some API path or a server to statically render the document.

Furthermore, if puzzles are described by an id, there must be some sort of database where the puzzles are stored.  If the puzzle is decoded from the query string, the link takes the role of the database.

However, there is a more important reason than the technical reasons to manage puzzles in this way.  This opens the door for a democratization of the project.  With an open format for storing puzzles, the player and builder become interchangable parts.  My player, for instance, doesn't yet support undo and redo.  If you wanted to play the puzzles for my player but want those features, you can implement your own player which decodes query strings in the same fashion.  My builder is a similarly bare-bones implementation, however any builder that knows how to encode puzzles properly can make puzzles and use my player (or any other).

While this is much less important for Sudoku puzzles than other applications, this approach is also resistant to censorship.  If someone somehow made an offensive Sudoku puzzle, there is no database from which it could be scrubbed.  To prevent distribution of the puzzle, the link itself would have to be censored from transmission across all platforms.

About the Builder
-----------------

The builder is a bare-bones implementation of a Sudoku puzzle builder.  It is meant solely as a reference implementation to show how puzzles theoretically could be constructed to be stored with query strings as the player exepcts.

Decoding and Encoding v1 Puzzles
--------------------------------

As described above, the string for a puzzle starts with a magic string, `S!`, and a version string, here `v1`.  What follows is the board binary encoded.

v1 only supports vanilla Sudoku puzzles.  This means that a puzzle's givens are all that are required to display it.  The givens of the puzzle are described by a list of `(cell, digit)` tuples.  Cell is of the range `0..80` and value is of the range `1..9`, each inclusive.  For instance, the list `[[19, 6], [57, 4]]` would describe a board with 6 in cell 19 and 4 in cell 57.

Because there are only 81 possible cell values and 9 possible digit values, it is possible to encode them in 7 and 4 bits respectively (`Math.ceil(Math.log2(n))` is the number of bits required to encode n different values simply).  Therefore, each `(cell, digit)` tuple requires 11 bits.  This means storing a puzzle with 17 givens takes `17 tuples * 11 bits/tuple = 187 bits`.  This is 23.375 bytes, which rounds up to 24 bytes.  While this method is simple and could definitely be improved, with 17 givens it already saves 10 bytes over just using a byte each for the cell and digit.

We can also take advantage of the fact that the 11 bytes/tuple is greater than the size of a single byte.  With the query string we can simple take 11 bytes at a time until there are no empty bytes left.  Because a tuple is larger than a full byte, there will always be another byte if we aren't finished taking tuples.  By this I mean we can have at most 7 bits remaining from the current byte after reading a tuple, since a tuple will never fit in 7 bits we know there is another tuple if and only if there is another byte.  Because of this property we do not need to store a count of tuples to be decoded, just keep taking tuples until the stream is exhausted.

For a reference implementation of encoding and decoding these puzzles, you can check out `src/encode.ts` and `src/decode.ts` respectively.

Future Work
-----------

This is sort of made as a proof-of-concept.  I think there is a lot of potential in using query strings for document description.  However, I also feel that this proof-of-concept can be expanded into a more proper application.

The player
- Undo/ Redo functionality
- Timer
- Board coloring
- Confetti when a puzzle is sucessfully finished :)
- A solve option
- Cells turn red if an invalid digit is placed

The builder
- Undo/ Redo functionality

I'm not a Sudoku setter so I'm not really sure what features a setter might find useful

The current format (v1 described above) only supports vanilla Sudoku puzzles and variants whose boards are identical to vanilla Sudoku (such as knights-move or kings-move).  It would be nice to make the format more flexible.

