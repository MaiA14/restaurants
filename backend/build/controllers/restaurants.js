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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../config"));
const constants_1 = require("../constants");
const dbService_1 = require("../db/dbService");
require('dotenv').config();
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const verifyRoles_1 = __importDefault(require("../middleware/verifyRoles"));
const restaurants_1 = __importDefault(require("../services/restaurants"));
class RestaurantsController {
    constructor() {
        this.path = `/api/${RestaurantsController.controllerName}`;
        this.router = express_1.default.Router();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + '/get', verifyJWT_1.default.verifyJWT, verifyRoles_1.default.verifyRoles(config_1.default.roles.ADMIN, config_1.default.roles.WAITER, config_1.default.roles.MANAGER), this.get);
        this.router.post(this.path + '/add', verifyJWT_1.default.verifyJWT, verifyRoles_1.default.verifyRoles(config_1.default.roles.ADMIN), this.add);
        this.router.post(this.path + '/delete/:id', verifyJWT_1.default.verifyJWT, verifyRoles_1.default.verifyRoles(config_1.default.roles.ADMIN), this.delete);
        this.router.put(this.path + '/update/:id', verifyJWT_1.default.verifyJWT, verifyRoles_1.default.verifyRoles(config_1.default.roles.ADMIN, config_1.default.roles.MANAGER), this.update);
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.role === config_1.default.roles.ADMIN) {
                try {
                    const restaurnts = yield new dbService_1.DBService().get(constants_1.COLLECTION.RESTAURANTS);
                    res.send(restaurnts);
                }
                catch (e) {
                    res.status(404).send('Error 1 - could not get restuarnt data');
                    console.log('cannot get restaurant', e);
                    return;
                }
            }
            else if (req.role === config_1.default.roles.MANAGER || req.role === config_1.default.roles.WAITER) {
                let whereUser = {};
                const authHeader = req.headers['authorization'];
                let token;
                if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) {
                    token = authHeader.split(' ')[1];
                }
                ;
                whereUser['token'] = { operand: constants_1.OPERANDS.EQUALS, value: token };
                try {
                    const user = yield new dbService_1.DBService().get(constants_1.COLLECTION.USERS, null, whereUser);
                    const restaurants = user[0].restaurants; // query with where always returns array
                    let userRestaurants = [];
                    for (let i = 0; i < restaurants.length; i++) {
                        const restaurantData = yield restaurants_1.default.getRestaurantByName(restaurants[i]);
                        console.log('res', restaurantData);
                        if (!restaurantData.chain) {
                            // find the chain of the restaurant
                            let whereChain = { 'chain': { operand: constants_1.OPERANDS.EQUALS, value: restaurantData.name } };
                            whereChain['chain'] = { operand: constants_1.OPERANDS.EQUALS, value: restaurantData.name };
                            const restaurants = yield new dbService_1.DBService().get(constants_1.COLLECTION.RESTAURANTS, null, whereChain);
                            // merge restaurants with chain and regular restaurants
                            userRestaurants = [restaurantData, ...restaurants];
                        }
                        else {
                            // restaurants with chain
                            userRestaurants.push(restaurantData);
                        }
                    }
                    for (let i = 0; i < userRestaurants.length; i++) {
                        if (userRestaurants[i].active === 'inactive') {
                            userRestaurants.splice(i, 1);
                        }
                    }
                    res.send(userRestaurants);
                }
                catch (e) {
                    console.log('get error', e);
                }
            }
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body) {
                res.status(404).send('Error 1 - could not add new restuarnt');
                return;
            }
            try {
                const newRestaurants = yield new dbService_1.DBService().add(constants_1.COLLECTION.RESTAURANTS, req.body);
                res.send(newRestaurants);
            }
            catch (e) {
                res.status(404).send('Error 2 - could not add new restaurant');
                console.log('cannot get restaurant', e);
                return;
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                res.status(404).send('Error 1 - could not delete restuarnt');
                return;
            }
            try {
                const updatedRestaurant = yield new dbService_1.DBService().set(constants_1.COLLECTION.RESTAURANTS, req.params.id, { 'active': 'inactive' }, true);
                res.send(updatedRestaurant);
            }
            catch (e) {
                res.status(404).send('Error 2 - could not delete restaurant');
                console.log('cannot get restaurant', e);
                return;
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.params.id) {
                res.status(404).send('Error 1 - could not update restuarnt details');
                return;
            }
            if (req.role === config_1.default.roles.MANAGER) {
                const updatedDetails = {};
                if (req.body.name) {
                    updatedDetails.name = req.body.name;
                }
                if (req.body.name) {
                    updatedDetails.country = req.body.country;
                }
                try {
                    const updatedRestaurant = yield new dbService_1.DBService().set(constants_1.COLLECTION.RESTAURANTS, req.params.id, updatedDetails);
                    res.send(updatedRestaurant);
                }
                catch (e) {
                    res.status(404).send('Error 2 - could not update restaurant');
                    console.log('cannot get restaurant', e);
                    return;
                }
            }
            else if (req.role === config_1.default.roles.ADMIN) {
                try {
                    const updatedRestaurant = yield new dbService_1.DBService().set(constants_1.COLLECTION.RESTAURANTS, req.params.id, req.body);
                    res.send(updatedRestaurant);
                }
                catch (e) {
                    res.status(404).send('Error 2 - could not update restaurant');
                    console.log('cannot get restaurant', e);
                    return;
                }
            }
        });
    }
}
exports.default = RestaurantsController;
RestaurantsController.controllerName = 'restaurants';
