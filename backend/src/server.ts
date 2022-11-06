import App from "./app";
import config from "./config";
import { DBS } from "./constants";
import AuthController from "./controllers/auth";
import RestaurantsController from "./controllers/restaurants";
import { DBService } from "./db/dbService";

let dbType = DBS.MONGO;
let db = new DBService(dbType);

const controllers = {
    [AuthController.controllerName]: new AuthController(),
    [RestaurantsController.controllerName]: new RestaurantsController()
};

// choose db
switch (dbType) {
    case DBS.MONGO: {
        db.connect().then(async () => {
            const app = new App(controllers, config.server.port);
            app.listen();
        });
    }
}

// handle disconnect 
function notifyExit() {
    return new Promise(async function (resolve, reject) {
        try {
            await new DBService().disconnect();
            resolve('');
        } catch (e) {
            console.log(e);
            reject();
        }
    });
}

process.on("uncaughtException", async function (err: any) {
    console.log("uncaughtException...", err.stack);
    if (err.code != "EADDRNOTAVAIL" && err.code != "EADDRINUSE") {
        try {
            await new DBService().disconnect();

        } catch (e) {
            console.log(e);
        }
    }
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

