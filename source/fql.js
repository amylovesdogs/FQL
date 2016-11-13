'use strict';

var Plan = require('./plan');

function FQL (table) {
    this.table = table;
    this.plan = new Plan();
    //this.rowIds = [];
    this.rows = [];
    this.joinTable = null;
}

FQL.prototype.get = function() {
    this.table.getRowIds();
    if (!this.joinTable) {
        // do select
        for (let i=0; i<this.table.rowIds.length && this.plan.withinLimit(this.rows); i++) {
            var newRow = this.table.read(i);
            if (this.plan.matchesRow(newRow)) {
                this.rows.push(this.plan.selectColumns(newRow));
            }
        }  
    } else {
        // do join

        // read in the tables
        let rows1 = [];
        let rows1Ids = this.table.rowIds;
        let rows2 = [];
        let rows2Ids = this.joinTable.getRowIds();
        for (let i=0; i<rows1Ids.length; i++) {
            let newRow = this.table.read(i);
            if (this.plan.matchesRow(newRow)) {
                rows1.push(newRow);
            }
        }
        for (let i=0; i<rows2Ids.length; i++) rows2[i] = this.joinTable.read(i);
        // console.log("first table");
        // console.log(rows1);
        //console.log("second table");
        //console.log(rows2);
        // find the matching rows
        for (var i=0; i<rows1.length; i++) {
            for (var j=0; j<rows2.length; j++) {
                if (this.plan.condition(rows1[i],rows2[j]))
                    this.rows.push(FQL.merge(rows1[i],rows2[j]));
            }
        }   
    }
    
    return this.rows;
}

FQL.prototype.count = function() {
    return this.table.numRows();
}

FQL.prototype.clone = function() {
    var newFQL = new FQL(this.table);
    newFQL.plan = this.plan;
    newFQL.rows = this.rows;
    newFQL.rowIds = this.rowIds;
    return newFQL;
}

FQL.prototype.limit = function (num) {
    var newFQL = this.clone();
    newFQL.plan.setLimit(num);
    return newFQL;
}


FQL.prototype.select = function() {
    var newFQL = this.clone();
    newFQL.plan.setSelected(Array.prototype.slice.call(arguments,0));
    return newFQL;
}

FQL.prototype.where = function(criteria) {
    var newFQL = this.clone();
    newFQL.plan.setCriteria(criteria);
    return newFQL;
}

FQL.merge = function(obj1,obj2) {
    var newObj = {};
    var keys = Object.keys(obj1);
    for (var i=0; i<keys.length; i++) {
        newObj[keys[i]] = obj1[keys[i]];
    }
    var keys = Object.keys(obj2);
    for (var i=0; i<keys.length; i++) {
            newObj[keys[i]] = obj2[keys[i]];
    }
    return newObj;
}

FQL.prototype.where = function(criteria) {
    var newFQL = this.clone();
    newFQL.plan.setCriteria(criteria);
    return newFQL;
}

FQL.prototype.innerJoin = function(fql,condition) {
    var newFQL = this.clone();
    newFQL.joinTable = fql.table;
    newFQL.plan.setCondition(condition);
    return newFQL;
}


module.exports = FQL;