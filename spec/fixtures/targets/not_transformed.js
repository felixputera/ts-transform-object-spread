"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function bar(first, second) {
    var temp = __assign(__assign({}, first), { b: second.b });
    return __assign({}, temp);
}
function anyInput(input) {
    return __assign({}, input);
}
