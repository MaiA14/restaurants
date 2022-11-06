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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const constants_1 = require("../constants");
const dbService_1 = require("../db/dbService");
class AuthController {
    constructor() {
        this.path = `/api/${AuthController.controllerName}`;
        this.router = express_1.default.Router();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path + '/signup', this.signup);
        this.router.post(this.path + '/login', this.login);
        this.router.get(this.path + '/refreshToken', this.refreshToken);
        this.router.get(this.path + 'logout', this.logout);
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, role, memberof } = req.body;
            if (!email || !password) {
                return res.status(400).json(({ 'message': 'Email and password are required.' }));
            }
            // check for duplicate usernames in the db
            const duplicate = yield new dbService_1.DBService().get(constants_1.COLLECTION.USERS, email);
            if (duplicate)
                return res.sendStatus(409); // Conflict 
            try {
                //encrypt the password
                const hashedPwd = yield bcrypt_1.default.hash(password, 10);
                //store the new user
                const newUser = { "email": email, "password": hashedPwd, "role": role };
                yield new dbService_1.DBService().set(constants_1.COLLECTION.USERS, email, newUser);
                res.status(201).json({ 'success': `New user ${newUser.email} created!` });
            }
            catch (e) {
                res.status(500).json({ 'message': e.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json(({ 'message': 'Username and password are required.' }));
            }
            const foundUser = yield new dbService_1.DBService().get(constants_1.COLLECTION.USERS, email);
            if (!foundUser) {
                console.log('could not find user ');
                return res.status(400).json({ 'message': 'Unauthorized .' });
            }
            const match = yield bcrypt_1.default.compare(password, foundUser.password);
            if (match) {
                const role = foundUser.role;
                // create JWTs
                const accessToken = jsonwebtoken_1.default.sign({
                    "UserInfo": {
                        "email": foundUser.email,
                        "role": role
                    }
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                const refreshToken = jsonwebtoken_1.default.sign({ "email": foundUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
                // Saving refreshToken with current user
                yield new dbService_1.DBService().set(constants_1.COLLECTION.USERS, foundUser.email, { token: accessToken, refreshToken: refreshToken }, true);
                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
                res.json({ accessToken });
            }
            else {
                return res.status(401).json({ 'message': 'Unauthorized.' });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = req.cookies;
            if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
                return res.satus(401).send();
            const refreshToken = cookies.jwt;
            const foundUser = yield new dbService_1.DBService().get(constants_1.COLLECTION.USERS, refreshToken);
            if (!foundUser) {
                //Forbidden 
                return res.status(403).send();
            }
            // evaluate jwt 
            jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err || foundUser.email !== decoded.email) {
                    return res.sendStatus(403);
                }
                const role = foundUser.role;
                const accessToken = jsonwebtoken_1.default.sign({
                    "email": decoded.email,
                    "role": role
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
                res.json({ accessToken });
            });
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // On client, also delete the accessToken
            const cookies = req.cookies;
            if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
                return res.sendStatus(204); //No content
            const refreshToken = cookies.jwt;
            // Is refreshToken in db?
            const foundUser = yield new dbService_1.DBService().get(constants_1.COLLECTION.USERS, refreshToken);
            if (!foundUser) {
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                return res.status(204).send();
            }
            // Delete refreshToken in db
            yield new dbService_1.DBService().set(constants_1.COLLECTION.USERS, null, { refreshToken: '' }, null);
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            res.status(204).sned();
        });
    }
}
exports.default = AuthController;
AuthController.controllerName = 'auth';
