'use strict';

let assert = require('assert');
let m2t = require('..');

describe('magnet2torrent', function() {
    this.timeout(10000);

    it('invalid uri', function() {
        m2t('mgnet:?xt=urn:btih:g229d3ac324ea8c2af60c97359cdb03ba0aae4ed', function(err, filename) {
            assert(err);
        });
        m2t('229D3AC324EA8C2AF60C97359CDB03BA0AAE4ED', function(err, filename) {
            assert(err);
        });
    });

    it('successful get by uri', function(done) {
        m2t('magnet:?xt=urn:btih:66B106B04F931DA3485282C43CF66F6BD795C8C4', function(err, filename) {
            assert(filename);
            done(err);
        });
    });

    it('successful get by hash', function(done) {
        m2t('66b106b04f931da3485282c43cf66f6bd795c8c4', function(err, filename) {
            assert(filename);
            done(err);
        });
    });

    it('not found', function(done) {
        m2t('magnet:?xt=urn:btih:66B106B04F931DA3485282C43CF66F6BD795C8C5', function(err, filename) {
            assert(err);
            done();
        });
    });
});
