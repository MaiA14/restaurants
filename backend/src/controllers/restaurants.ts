import express from "express";
import _ from "lodash";
import config from "../config";
import { COLLECTION, OPERANDS } from "../constants";
import { DBService } from "../db/dbService";
require('dotenv').config();

import VerifyJWT from "../middleware/verifyJWT";
import VerifyRoles from "../middleware/verifyRoles";
import RestaurantsService from "../services/restaurants";

export default class RestaurantsController {
    public static controllerName = 'restaurants';
    public middleware: any;
    public path = `/api/${RestaurantsController.controllerName}`;
    public router: any = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(
            this.path + '/get',
            VerifyJWT.verifyJWT,
            VerifyRoles.verifyRoles(config.roles.ADMIN, config.roles.WAITER, config.roles.MANAGER),
            this.get
        );
        this.router.post(
            this.path + '/add',
            VerifyJWT.verifyJWT,
            VerifyRoles.verifyRoles(config.roles.ADMIN),
            this.add
        );
        this.router.post(
            this.path + '/deactivate/:id',
            VerifyJWT.verifyJWT,
            VerifyRoles.verifyRoles(config.roles.ADMIN),
            this.deactivate
        );
        this.router.delete(
            this.path + '/delete/:id',
            VerifyJWT.verifyJWT,
            VerifyRoles.verifyRoles(config.roles.ADMIN),
            this.delete
        );
        this.router.put(
            this.path + '/update/:id',
            VerifyJWT.verifyJWT,
            VerifyRoles.verifyRoles(config.roles.ADMIN, config.roles.MANAGER),
            this.update
        );
    }

    private async get(req: any, res: any) {
        if (req.role === config.roles.ADMIN) {
            try {
                const restaurnts = await new DBService().get(COLLECTION.RESTAURANTS);
                res.send(restaurnts);
            } catch (e) {
                res.status(404).send('Error 1 - could not get restuarnt data');
                console.log('cannot get restaurant', e);
                return;
            }
        }

        else if (req.role === config.roles.MANAGER || req.role === config.roles.WAITER) {
            let whereUser: any = {};
            const authHeader = req.headers['authorization'];
            let token;
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            };

            whereUser['token'] = { operand: OPERANDS.EQUALS, value: token };
            try {
                const user = await new DBService().get(COLLECTION.USERS, null, whereUser);
                const restaurants = user[0].restaurants; // query with where always returns array
                let userRestaurants: any = [];
                for (let i = 0; i < restaurants.length; i++) {
                    const restaurantData: any = await RestaurantsService.getRestaurantByName(restaurants[i]);
                    console.log('res', restaurantData);
                    if (!restaurantData.chain) {
                        // find the chain of the restaurant
                        let whereChain: any = { 'chain': { operand: OPERANDS.EQUALS, value: restaurantData.name } }
                        whereChain['chain'] = { operand: OPERANDS.EQUALS, value: restaurantData.name };
                        const restaurants = await new DBService().get(COLLECTION.RESTAURANTS, null, whereChain);
                        // merge restaurants with chain and regular restaurants
                        userRestaurants = [restaurantData, ...restaurants];
                    } else {
                        // restaurants with chain
                        userRestaurants.push(restaurantData)
                    }
                }

                for (let i = 0; i < userRestaurants.length; i++) {
                    if (userRestaurants[i].active === 'inactive') {
                        userRestaurants.splice(i, 1);
                    }
                }

                res.send(userRestaurants);
            } catch (e) {
                console.log('get error', e)
            }
        }
    }


    public async add(req: any, res: any) {
        if (!req.body) {
            res.status(404).send('Error 1 - could not add new restuarnt');
            return;
        }

        try {
            let where: any = {};
            where['name'] = { operand: OPERANDS.EQUALS, value: req.body.name };
            const restaurant = await new DBService().get(COLLECTION.RESTAURANTS, null, where);

            // aviod adding restaurant with the same name
            if (restaurant.length > 0) {
                res.status(500).send('Error 2 - restaurant already exists');
                return;
            }

            const newRestaurants = await new DBService().add(COLLECTION.RESTAURANTS, req.body);
            res.send(newRestaurants);
        } catch (e) {
            res.status(404).send('Error 3 - could not add new restaurant');
            console.log('cannot get restaurant', e);
            return;
        }
    }

    public async deactivate(req: any, res: any) {
        if (!req.params.id) {
            res.status(404).send('Error 1 - could not deactivate restuarnt');
            return;
        }

        try {
            const updatedRestaurant = await new DBService().set(COLLECTION.RESTAURANTS, req.params.id, { 'active': 'inactive' }, true);
            res.send(updatedRestaurant);
        } catch (e) {
            res.status(404).send('Error 2 - could not deactivate restaurant');
            console.log('cannot deactivate restaurant', e);
            return;
        }
    }

    public async delete(req: any, res: any) {
        if (!req.params.id) {
            res.status(404).send('Error 1 - could not deactivate restuarnt');
            return;
        }

        try {
            await new DBService().delete(COLLECTION.RESTAURANTS, req.params.id);
            res.send();
        } catch (e) {
            res.status(404).send('Error 2 - could not delete restaurant');
            console.log('cannot delete restaurant', e);
            return;
        }
    }

    public async update(req: any, res: any) {
        if (!req.body || !req.params.id) {
            res.status(404).send('Error 1 - could not update restuarnt details');
            return;
        }

        // update users restaurants according the new value of the restaurant 
        try {
            const currentDoc = await new DBService().get(COLLECTION.RESTAURANTS, req.params.id);
            const restaurant = currentDoc.name;
            const whereByRestaurant: any = {};
            whereByRestaurant['restaurants'] = { operand: OPERANDS.EQUALS, value: restaurant };
            const usersToUpdate = await new DBService().get(COLLECTION.USERS, null, whereByRestaurant);

            for (let i = 0; i < usersToUpdate.length; i++) {
                if (usersToUpdate[i].restaurants.includes(restaurant)) {
                    usersToUpdate[i].restaurants.splice(1, 1, req.body.name);
                }

                console.log(usersToUpdate);
                await new DBService().set(COLLECTION.USERS, usersToUpdate[i].id, usersToUpdate[i]);
            }
        } catch (e) {
            console.log('Error 2 - cannot update users restaurants ', e);
        }


        if (req.role === config.roles.MANAGER) {
            const updatedDetails: any = {};
            if (req.body.name) {
                updatedDetails.name = req.body.name;
            }

            if (req.body.name) {
                updatedDetails.country = req.body.country;
            }

            try {
                const updatedRestaurant = await new DBService().set(COLLECTION.RESTAURANTS, req.params.id, updatedDetails);
                res.send(updatedRestaurant);
            } catch (e) {
                res.status(404).send('Error 3 - could not update restaurant');
                console.log('cannot get restaurant', e);
                return;
            }
        } else if (req.role === config.roles.ADMIN) {
            try {
                const updatedRestaurant = await new DBService().set(COLLECTION.RESTAURANTS, req.params.id, req.body);
                res.send(updatedRestaurant);
            } catch (e) {
                res.status(404).send('Error 4 - could not update restaurant');
                console.log('cannot get restaurant', e);
                return;
            }
        }
    }
}
