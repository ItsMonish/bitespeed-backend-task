import express, { json, Request, Response } from 'express';
import identityRouter from './routers/identifyRoute';

class ApiServer {
    app = express();
    port: number;

    constructor(port: number = 8081) {
        this.port = port;
        this.app.use(json());
        this.addRoutes();
    }   

    addRoutes() {
        this.app.get("/", (_: Request, res: Response) => {
            console.log("[ii] Hit endpoint / redirecting to /identity");
            res.redirect("/identity");
        })

        this.app.use("/identity", identityRouter);
    }

    startServer() {
        this.app.listen(this.port, (err?: Error) => {
            if (err) console.log("[!!] Server failed to start at " + this.port);
            else console.log("[++] Server started successfully at " + this.port);
        })
    }
}

export { ApiServer };
