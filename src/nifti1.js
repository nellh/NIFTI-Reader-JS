
/*jslint browser: true, node: true */
/*global */

"use strict";

/*** Imports ***/

var nifti = nifti || {};
nifti.Utils = nifti.Utils || ((typeof require !== 'undefined') ? require('./utilities.js') : null);


/*** Constructor ***/
nifti.NIFTI1 = nifti.NIFTI1 || function () {
    this.littleEndian = false;
    this.dim_info = 0;
    this.dims = [];
    this.intent_p1 = 0;
    this.intent_p2 = 0;
    this.intent_p3 = 0;
    this.intent_code = 0;
    this.datatypeCode = 0;
    this.numBitsPerVoxel = 0;
    this.slice_start = 0;
    this.slice_end = 0;
    this.slice_code = 0;
    this.pixDims = [];
    this.vox_offset = 0;
    this.scl_slope = 1;
    this.scl_inter = 0;
    this.xyzt_units = 0;
    this.cal_max = 0;
    this.cal_min = 0;
    this.slice_duration = 0;
    this.toffset = 0;
    this.description = "";
    this.aux_file = "";
    this.intent_name = "";
    this.qform_code = 0;
    this.sform_code = 0;
    this.quatern_b = 0;
    this.quatern_c = 0;
    this.quatern_d = 0;
    this.qoffset_x = 0;
    this.qoffset_y = 0;
    this.qoffset_z = 0;
    this.affine = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    this.magic = 0;
};



/*** Static Pseudo-constants ***/

nifti.NIFTI1.MAGIC_COOKIE = 348;
nifti.NIFTI1.MAGIC_NUMBER_LOCATION = 344;
nifti.NIFTI1.MAGIC_NUMBER = [110, 43, 49];  // n+1



/*** Prototype Methods ***/

nifti.NIFTI1.prototype.readHeader = function (data) {
    var rawData = new DataView(data),
        magicCookieVal = nifti.Utils.getIntAt(rawData, 0, this.littleEndian),
        ctr,
        ctrOut,
        ctrIn,
        index;

    if (magicCookieVal !== nifti.NIFTI1.MAGIC_COOKIE) {  // try as little endian
        this.littleEndian = true;
        magicCookieVal = nifti.Utils.getIntAt(rawData, 0, this.littleEndian);
    }

    if (magicCookieVal !== nifti.NIFTI1.MAGIC_COOKIE) {
        throw new Error("This does not appear to be a NIFTI file!");
    }

    this.dim_info = nifti.Utils.getByteAt(rawData, 39);

    for (ctr = 0; ctr < 8; ctr += 1) {
        index = 40 + (ctr * 2);
        this.dims[ctr] = nifti.Utils.getShortAt(rawData, index, this.littleEndian);
    }

    this.intent_p1 = nifti.Utils.getFloatAt(rawData, 56, this.littleEndian);
    this.intent_p2 = nifti.Utils.getFloatAt(rawData, 60, this.littleEndian);
    this.intent_p3 = nifti.Utils.getFloatAt(rawData, 64, this.littleEndian);
    this.intent_code = nifti.Utils.getShortAt(rawData, 68, this.littleEndian);

    this.datatypeCode = nifti.Utils.getShortAt(rawData, 70, this.littleEndian);
    this.numBitsPerVoxel = nifti.Utils.getShortAt(rawData, 72, this.littleEndian);

    this.slice_start = nifti.Utils.getShortAt(rawData, 74, this.littleEndian);

    for (ctr = 0; ctr < 8; ctr += 1) {
        index = 76 + (ctr * 4);
        this.pixDims[ctr] = nifti.Utils.getFloatAt(rawData, index, this.littleEndian);
    }

    this.vox_offset = nifti.Utils.getFloatAt(rawData, 108, this.littleEndian);

    this.scl_slope = nifti.Utils.getFloatAt(rawData, 112, this.littleEndian);
    this.scl_inter = nifti.Utils.getFloatAt(rawData, 116, this.littleEndian);

    this.slice_end = nifti.Utils.getShortAt(rawData, 120, this.littleEndian);
    this.slice_code = nifti.Utils.getByteAt(rawData, 122);

    this.xyzt_units = nifti.Utils.getByteAt(rawData, 123);

    this.cal_max = nifti.Utils.getFloatAt(rawData, 124, this.littleEndian);
    this.cal_min = nifti.Utils.getFloatAt(rawData, 128, this.littleEndian);

    this.slice_duration = nifti.Utils.getFloatAt(rawData, 132, this.littleEndian);
    this.toffset = nifti.Utils.getFloatAt(rawData, 136, this.littleEndian);

    this.description = nifti.Utils.getStringAt(rawData, 148, 228);
    this.aux_file = nifti.Utils.getStringAt(rawData, 228, 252);

    this.qform_code = nifti.Utils.getShortAt(rawData, 252, this.littleEndian);
    this.sform_code = nifti.Utils.getShortAt(rawData, 254, this.littleEndian);

    this.quatern_b = nifti.Utils.getFloatAt(rawData, 256, this.littleEndian);
    this.quatern_c = nifti.Utils.getFloatAt(rawData, 260, this.littleEndian);
    this.quatern_d = nifti.Utils.getFloatAt(rawData, 264, this.littleEndian);
    this.qoffset_x = nifti.Utils.getFloatAt(rawData, 268, this.littleEndian);
    this.qoffset_y = nifti.Utils.getFloatAt(rawData, 272, this.littleEndian);
    this.qoffset_z = nifti.Utils.getFloatAt(rawData, 276, this.littleEndian);

    for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
        for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
            index = 280 + (((ctrOut * 4) + ctrIn) * 4);
            this.affine[ctrOut][ctrIn] = nifti.Utils.getFloatAt(rawData, index, this.littleEndian);
        }
    }

    this.affine[3][0] = 0;
    this.affine[3][1] = 0;
    this.affine[3][2] = 0;
    this.affine[3][3] = 1;

    this.intent_name = nifti.Utils.getStringAt(rawData, 328, 344);
    this.magic = nifti.Utils.getStringAt(rawData, 344, 348);
};



nifti.NIFTI1.prototype.getQformMat = function () {
    return nifti.convertNiftiQFormToNiftiSForm(this.quatern_b, this.quatern_c, this.quatern_d, this.qoffset_x,
        this.qoffset_y, this.qoffset_z, this.pixDims[1], this.pixDims[2], this.pixDims[3], this.pixDims[0]);
};



nifti.NIFTI1.prototype.toFormattedString = function () {
    var fmt = nifti.Utils.formatNumber,
        string = "";

    string += ("Dim Info = " + this.dim_info + "\n");

    string += ("Image Dimensions (1-8): " +
        this.dims[0] + ", " +
        this.dims[1] + ", " +
        this.dims[2] + ", " +
        this.dims[3] + ", " +
        this.dims[4] + ", " +
        this.dims[5] + ", " +
        this.dims[6] + ", " +
        this.dims[7] + "\n");

    string += ("Intent Parameters (1-3): " +
        this.intent_p1 + ", " +
        this.intent_p2 + ", " +
        this.intent_p3) + "\n";

    string += ("Intent Code = " + this.intent_code + "\n");
    string += ("Datatype = " + this.datatypeCode + "\n");
    string += ("Bits Per Voxel = " + this.numBitsPerVoxel + "\n");
    string += ("Slice Start = " + this.slice_start + "\n");
    string += ("Voxel Dimensions (1-8): " +
        fmt(this.pixDims[0]) + ", " +
        fmt(this.pixDims[1]) + ", " +
        fmt(this.pixDims[2]) + ", " +
        fmt(this.pixDims[3]) + ", " +
        fmt(this.pixDims[4]) + ", " +
        fmt(this.pixDims[5]) + ", " +
        fmt(this.pixDims[6]) + ", " +
        fmt(this.pixDims[7]) + "\n");

    string += ("Image Offset = " + this.vox_offset + "\n");
    string += ("Data Scale:  Slope = " + this.scl_slope + "  Intercept = " + this.scl_inter+ "\n");
    string += ("Slice End = " + this.slice_end + "\n");
    string += ("Slice Code = " + this.slice_code + "\n");
    string += ("Units Code = " + this.xyzt_units + "\n");
    string += ("Display Range:  Max = " + this.cal_max + "  Min = " + this.cal_min + "\n");
    string += ("Slice Duration = " + this.slice_duration + "\n");
    string += ("Time Axis Shift = " + this.toffset + "\n");
    string += ("Description: \"" + this.description + "\"\n");
    string += ("Auxiliary File: \"" + this.aux_file + "\"\n");
    string += ("Q-Form Code = " + this.qform_code + "\n");
    string += ("S-Form Code = " + this.sform_code + "\n");
    string += ("Quaternion Parameters:  " +
        "b = " + fmt(this.quatern_b) + "  " +
        "c = " + fmt(this.quatern_c) + "  " +
        "d = " + fmt(this.quatern_d) + "\n");

    string += ("Quaternion Offsets:  " +
        "x = " + this.qoffset_x + "  " +
        "y = " + this.qoffset_y + "  " +
        "z = " + this.qoffset_z + "\n");

    string += ("S-Form Parameters X: " +
        fmt(this.affine[0][0]) + ", " +
        fmt(this.affine[0][1]) + ", " +
        fmt(this.affine[0][2]) + ", " +
        fmt(this.affine[0][3]) + "\n");

    string += ("S-Form Parameters Y: " +
        fmt(this.affine[1][0]) + ", " +
        fmt(this.affine[1][1]) + ", " +
        fmt(this.affine[1][2]) + ", " +
        fmt(this.affine[1][3]) + "\n");

    string += ("S-Form Parameters Z: " +
        fmt(this.affine[2][0]) + ", " +
        fmt(this.affine[2][1]) + ", " +
        fmt(this.affine[2][2]) + ", " +
        fmt(this.affine[2][3]) + "\n");

    string += ("Intent Name: \"" + this.intent_name + "\"\n");

    return string;
};



/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = nifti.NIFTI1;
}
