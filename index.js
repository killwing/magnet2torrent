#!/usr/bin/env iojs
'use strict';

let request = require('request');
let fs = require('fs');

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

function getTorrent(url, hash) {
    console.log('Get torrent from:', url);
    request.get(url)
        .on('error', function(err) {
            console.log('Error:', err, ', try next');
            getNext(hash);
        })
        .on('response', function(response) {
            if (response.statusCode == 200) {
                if (response.headers['content-type'] == 'application/octet-stream') {
                    let filename = hash + '.torrent';
                    console.log('Done, file saved as', filename);
                    response.pipe(fs.createWriteStream(filename));
                } else {
                    console.log('Server responded invalid type:', response.headers['content-type'], ', try next');
                    getNext(hash);
                }
            } else {
                console.log('Server responded:', response.statusCode, ', try next');
                getNext(hash);
            }
        });
}

function getNext(hash) {
    if (servIdx != servUrl.length) {
        getTorrent(servUrl[servIdx++](hash), hash);
    } else {
        console.log('Failed to get torrent, all services tried.');
    }
}

module.exports = function(hash) {
    getNext(hash);
};
