"use strict";
var emptyObj = {};
var firstObj = {
    one: 1
};
var secondObj = {
    one: firstObj.one,
    two: 2,
    three: 3
};
var thirdObj = {
    two: secondObj.two,
    three: secondObj.three,
    one: secondObj.one,
    four: 4
};
