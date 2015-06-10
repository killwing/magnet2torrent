#!/usr/bin/env iojs
'use strict';

let m2t = require('..');

if (process.argv.length != 3) {
    console.log('usage: ', process.argv[1], ' <magnet uri/info hash>');
    process.exit(1);
}

m2t(process.argv[2], function(err, filename) {
    if (err) {
        console.log('Failed to get torrent:', err);
    } else {
        console.log('Done, file saved as', filename);
    }
});
