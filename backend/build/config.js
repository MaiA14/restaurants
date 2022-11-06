"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_NAME = 'restaurants';
const SERVER_PORT = 9000;
const SERVER_IP = '127.0.0.1'; // localhost
const SERVER = {
    dbName: DB_NAME,
    port: SERVER_PORT,
    ip: SERVER_IP
};
const config = {
    server: SERVER
};
exports.default = config;
