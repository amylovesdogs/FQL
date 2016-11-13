'use strict';

function Plan () {
    this.criteria = null;
    this.selected = [];
    this.limit = -1;
}

Plan.prototype.setLimit = function(num) {
    this.limit = num;
}

Plan.prototype.withinLimit = function(arr) {
    //console.log(`In withinLimit. Array is now of length ${arr.length}, limit is ${this.limit}`);
    if (this.limit === -1) {
        return true;
    } else {
        return arr.length < this.limit;
    }
}

Plan.prototype.setSelected = function(selected) {
//    console.log("In setSelected. selected is:");
//    console.log(selected);
   this.selected = selected;
}

Plan.prototype.selectColumns = function(row) {
    // console.log("selectColumns: selected is");
    // console.log(this.selected);
    if (!this.selected.length || this.selected[0] === "*") return row;
    var newRow = {};
    for (var i=0; i<this.selected.length; i++) {
        // console.log("copying column: "+this.selected[i]);
        newRow[this.selected[i]] = row[this.selected[i]];
    }
    // console.log("returning new obj: ");
    // console.log(newRow);
    return newRow;
}

Plan.prototype.setCriteria = function(criteria) {
   this.criteria = criteria;
}

Plan.prototype.setCondition = function(condition) {
   this.condition = condition;
}

// does the criteria match the row
Plan.prototype.matchesRow = function(row) {
    if (!this.criteria) return true;
    // console.log(`matcheRow: criteria=`);
    // console.log(this.criteria);
    var keys = Object.keys(this.criteria);
    return keys.reduce((accumulatorVal,key) => {
                    // console.log(`matchRow: key=${key}`);
                    // console.log(`matchRow: row=${row[key]}`);
                    // console.log(`matchRow: criteria=${this.criteria[key]}`);
                    // console.log(`matchRow: equals=${row[key] === this.criteria[key]}`);
                    if (typeof this.criteria[key] === 'function') {
                        return accumulatorVal && this.criteria[key](row[key]);
                    } else {
                        return accumulatorVal && (row[key] === this.criteria[key]);
                    }
                 },
                 true);
}

module.exports = Plan;



