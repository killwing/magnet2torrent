#!/usr/bin/env iojs
'use strict';

let fs = require('fs');
let mguri = require('magnet-uri');
let request = require('request');

let servIdx = 0;
let servUrl = [
    function(hash) {
        return 'http://bt.box.n0808.com/' + hash.slice(0, 2) + '/' + hash.slice(-2)+ '/' + hash + '.torrent';
    },
    function(hash) {
        return 'http://torrage.com/torrent/' + hash + '.torrent';
    },
    function(hash) {
        return 'http://torcache.net/torrent/' + hash + '.torrent';
    }
    //http://btcache.me/torrent/013060CD7E3C6CD61A2CC983F1714C9359928EFE
];

function parseInfoHash(uri) {
    let uriObj = mguri.decode(uri);
    let hash = uriObj.infoHash || uri;
    if (/^[A-Za-z0-9]{40}$/.test(hash)) {
        return hash.toUpperCase();
    }
}

function getTorrent(url, hash, cb) {
    console.log('Get torrent from:', url);
    request.get(url)
        .on('error', function(err) {
            cb(err);
        })
        .on('response', function(response) {
            if (response.statusCode == 200) {
                if (response.headers['content-type'] == 'application/octet-stream') {
                    let filename = hash + '.torrent';
                    response.pipe(fs.createWriteStream(filename));
                    cb(null, filename);
                } else {
                    cb('Invalid content type: ' + response.headers['content-type']);
                }
            } else {
                cb('Error response: ' + response.statusCode);
            }
        });
}

function getNext(hash, cb) {
    if (servIdx != servUrl.length) {
        getTorrent(servUrl[servIdx++](hash), hash, function(err, filename) {
            if (err) {
                console.log(err);
                getNext(hash, cb);
            } else {
                cb(null, filename);
            }
        });
    } else {
        cb('All services tried.');
    }
}

module.exports = function(uri, cb) {
    let hash = parseInfoHash(uri);
    if (!hash) {
        cb('Invalid magnet uri or info hash.');
        return;
    }

    getNext(hash, cb);
};
