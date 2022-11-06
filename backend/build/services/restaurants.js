"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const dbService_1 = require("../db/dbService");
class RestaurantsService {
    static getRestaurantByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = {};
                where['name'] = { operand: constants_1.OPERANDS.EQUALS, value: name };
                const restaurant = yield new dbService_1.DBService().get(constants_1.COLLECTION.RESTAURANTS, null, where);
                return restaurant[0];
            }
            catch (e) {
                console.log('cannot get restaurant', e);
                return;
            }
        });
    }
}
exports.default = RestaurantsService;
