
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../src/nifti.js');

var buf = fs.readFileSync('./tests/data/avg152T1_LR_nifti2.nii.gz');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti2 = null;

describe('NIFTI-Reader-JS', function () {
    describe('compressed nifti-2 test', function () {
        it('isCompressed() should return true', function () {
            assert.equal(true, nifti.isCompressed(data));
        });

        it('should not throw error when decompressing', function (done) {
            assert.doesNotThrow(function() {
                data = nifti.decompress(data);
                done();
            });
        });

        it('isNIFTI1() should return false', function () {
            assert.equal(false, nifti.isNIFTI1(data));
        });

        it('isNIFTI2() should return true', function () {
            assert.equal(true, nifti.isNIFTI2(data));
        });

        it('should not throw error when reading header', function (done) {
            assert.doesNotThrow(function() {
                nifti2 = nifti.readHeader(data);
                done();
            });
        });
    });
});