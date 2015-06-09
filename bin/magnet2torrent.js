#!/usr/bin/env iojs
'use strict';

let mguri = require('magnet-uri');
let m2t = require('..');

if (process.argv.length != 3) {
    console.log('usage: ', process.argv[1], ' <magnet uri/info hash>');
    process.exit(1);
}

let uri = mguri.decode(process.argv[2]);
let hash = uri.infoHash || process.argv[2];
if (!/^[A-Za-z0-9]{40}$/.test(hash)) {
    console.log('Invalid magnet uri or info hash');
    process.exit(1);
}

m2t(hash.toUpperCase());
