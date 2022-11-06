import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session'

export class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: any, port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        const corsOptions = {
            origin: 'http://localhost:3000',
            credentials: true
        };
        this.app.use(cors(corsOptions));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        
        this.app.use(
            session({
                secret: 'keyboard cat',
                resave: false,
                saveUninitialized: true,
                cookie: { secure: false },
            }),
        );
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private initializeControllers(controllers: any) {
        const routers: any = [];
        Object.keys(controllers).forEach((key: any) => {
            routers.push(controllers[key].router);
        });
        this.app.use('/', routers);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;