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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const constants_1 = require("./constants");
const dbService_1 = require("./db/dbService");
let dbType = constants_1.DBS.MONGO;
let db = new dbService_1.DBService(dbType);
const controllers = {
// [MessagesController.controllerName]: new MessagesController(),
// [OrdersController.controllerName]: new OrdersController(),
// [CustomersController.controllerName] : new CustomersController()
};
// choose db
switch (dbType) {
    case constants_1.DBS.MONGO: {
        db.connect().then(() => __awaiter(void 0, void 0, void 0, function* () {
            const app = new app_1.default(controllers, config_1.default.server.port);
            app.listen();
        }));
    }
}
// handle disconnect 
function notifyExit() {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new dbService_1.DBService().disconnect();
                resolve('');
            }
            catch (e) {
                console.log(e);
                reject();
            }
        });
    });
}
process.on("uncaughtException", function (err) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("uncaughtException...", err.stack);
        if (err.code != "EADDRNOTAVAIL" && err.code != "EADDRINUSE") {
            try {
                yield new dbService_1.DBService().disconnect();
            }
            catch (e) {
                console.log(e);
            }
        }
    });
});
process.on('SIGINT', function () {
    console.log("SIGINT...");
    notifyExit()
        .then(function () {
        process.exit(1);
    })
        .catch(function () {
        process.exit(1);
    });
});
process.on('SIGTERM', function () {
    console.log("SIGTERM...");
    notifyExit()
        .then(function () {
        process.exit(1);
    })
        .catch(function () {
        process.exit(1);
    });
});
process.on('SIGQUIT', function () {
    console.log("SIGQUIT...");
    notifyExit()
        .then(function () {
        process.exit(1);
    })
        .catch(function () {
        process.exit(1);
    });
});
process.on('exit', function (code) {
    console.log("exit...", code);
});
