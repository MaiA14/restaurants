import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv').config();

import { COLLECTION } from "../constants";
import { DBService } from "../db/dbService";

export default class AuthController {
    public static controllerName = 'auth';
    public path = `/api/${AuthController.controllerName}`;
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(this.path + '/signup', this.signup);
        this.router.post(this.path + '/login', this.login);
        this.router.get(this.path + '/refreshToken', this.refreshToken);
        this.router.get(this.path + 'logout', this.logout);
    }

    public async signup(req: any, res: any) {
        const { email, password, role, memberof } = req.body;
        if (!email || !password) {
            return res.status(400).json(({ 'message': 'Email and password are required.' }));
        }
        // check for duplicate usernames in the db
        const duplicate = await new DBService().get(COLLECTION.USERS, email);
        if (duplicate) return res.sendStatus(409); // Conflict 
        try {
            //encrypt the password
            const hashedPwd = await bcrypt.hash(password, 10);
            //store the new user
            const newUser = { "email": email, "password": hashedPwd, "role": role };
            await new DBService().set(COLLECTION.USERS, email, newUser);
            res.status(201).json({ 'success': `New user ${newUser.email} created!` });
        } catch (e: any) {
            res.status(500).json({ 'message': e.message });
        }
    }

    public async login(req: any, res: any) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(({ 'message': 'Username and password are required.' }));
        }
        const foundUser = await new DBService().get(COLLECTION.USERS, email);
        if (!foundUser) {
            console.log('could not find user ');
            return res.status(400).json({ 'message': 'Unauthorized .' });
        }
        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            const role = foundUser.role;
            // create JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            const refreshToken = jwt.sign(
                { "email": foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user
            await new DBService().set(COLLECTION.USERS, foundUser.email, { token: accessToken, refreshToken: refreshToken }, true);
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        } else {
            return res.status(401).json({ 'message': 'Unauthorized.' });
        }
    }

    public async refreshToken(req: any, res: any) {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.satus(401).send();
        const refreshToken = cookies.jwt;

        const foundUser = await new DBService().get(COLLECTION.USERS, refreshToken);
        if (!foundUser) {
            //Forbidden 
            return res.status(403).send();
        }

        // evaluate jwt 
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err: any, decoded: any) => {
                if (err || foundUser.email !== decoded.email) {
                    return res.sendStatus(403);
                }
                const role = foundUser.role;
                const accessToken = jwt.sign(
                    {
                        "email": decoded.email,
                        "role": role
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '5m' }
                );
                res.json({ accessToken })
            }
        );
    }


    public async logout(req: any, res: any) {
        // On client, also delete the accessToken
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); //No content
        const refreshToken = cookies.jwt;

        // Is refreshToken in db?
        const foundUser = await new DBService().get(COLLECTION.USERS, refreshToken);
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.status(204).send();
        }

        // Delete refreshToken in db
        await new DBService().set(COLLECTION.USERS, null, { refreshToken: '' }, null);
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(204).sned();
    }

}
