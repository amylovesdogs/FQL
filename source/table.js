'use strict';

var fs = require('fs');

function Table (path) {
    this.path = path + "/";
    this.rowIds = [];
    // this.rows = [];
    // this.loaded = false;
}

Table.toFilename = function(id) {
        return ("0000" + id).slice(-4)  + ".json";
}

Table.toId = function(filename) {
        return +filename.slice(0,-5);
}

Table.prototype.read = function(id) {
    var filename = this.path + Table.toFilename(id);
    return JSON.parse(fs.readFileSync(filename, 'utf8'));

// var fs = require('fs');
// var obj;
// fs.readFile('file', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
// });
}

Table.prototype.getRowIds = function() {
    // var rows = fs.readdirSync(this.path);
    // rows = rows.slice(1);
    this.rowIds = fs.readdirSync(this.path).slice(1).map(Table.toId);
    return this.rowIds;
// var fs = require('fs');
// var obj;
// fs.readFile('file', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
// });
}

Table.prototype.numRows = function() {
    // console.log("In numRows");
    // console.log(this.rowIds.length);
    if (this.rowIds.length === 0) this.getRowIds();
    // console.log(this.rowIds);
    return this.rowIds.length;
}

// Table.prototype.loadRows = function(row) {
//     // console.log("In loadRows");
//     this.rowIds = this.getRowIds();
//     for (let i=0; i<this.rowIds.length; i++) {
//         this.rows[i] = this.read(i);
//     }  
//     this.loaded = true;
//     // console.log(this.rows);
//     // console.log("Natively rows are "+this.rows.length);
//     // console.log("Num rows are: "+this.numRows());
//     return this.rows;
// }

// Table.prototype.dumpRows = function() {
//     // console.log("In dumpRows");
//     // console.log("Rows: "+this.rows);
//     // console.log("Num rows: "+this.rows.length);
//     return this.rows;
// }


module.exports = Table;