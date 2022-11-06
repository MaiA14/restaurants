const DB_NAME = 'restaurants';
const SERVER_PORT = 9000;
const SERVER_IP = '127.0.0.1'; // localhost

const SERVER = {
    dbName: DB_NAME,
    port: SERVER_PORT,
    ip: SERVER_IP
}

const ROLES_LIST = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    WAITER: 'waiter'
}

const config = {
    server: SERVER,
    roles: ROLES_LIST
}

export default config;