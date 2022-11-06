"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
class App {
    constructor(controllers, port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    initializeMiddlewares() {
        const corsOptions = {
            origin: '*',
            credentials: true
        };
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(body_parser_1.default.json());
        this.app.use((0, express_session_1.default)({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
        }));
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
    }
    initializeControllers(controllers) {
        const routers = [];
        Object.keys(controllers).forEach((key) => {
            routers.push(controllers[key].router);
        });
        this.app.use('/', routers);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
exports.App = App;
exports.default = App;
