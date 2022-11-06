"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_BY_DIRECTION = exports.OPERANDS = exports.COLLECTION = exports.DBS = void 0;
exports.DBS = {
    MONGO: 'mongo'
};
exports.COLLECTION = {
    RESTAURANTS: 'restaurants',
    USERS: 'users'
};
var OPERANDS;
(function (OPERANDS) {
    OPERANDS["EQUALS"] = "==";
    OPERANDS["LOWER_THAN"] = "<";
    OPERANDS["GREATER_THAN"] = ">";
    OPERANDS["LOWER_OR_EQUALS"] = "<=";
    OPERANDS["GREATER_OR_EQUALS"] = ">=";
    OPERANDS["NOT_EQUALS"] = "!=";
    OPERANDS["ARRAY_CONTAINS"] = "array-contains";
    OPERANDS["ARRAY_CONTAINS_ANY"] = "array-contains-any";
    OPERANDS["IN"] = "in";
    OPERANDS["CONTAINED"] = "contained";
})(OPERANDS = exports.OPERANDS || (exports.OPERANDS = {}));
var ORDER_BY_DIRECTION;
(function (ORDER_BY_DIRECTION) {
    ORDER_BY_DIRECTION["ASC"] = "asc";
    ORDER_BY_DIRECTION["DESC"] = "desc";
})(ORDER_BY_DIRECTION = exports.ORDER_BY_DIRECTION || (exports.ORDER_BY_DIRECTION = {}));
