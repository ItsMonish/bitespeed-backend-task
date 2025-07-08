import { Request, Response, Router } from "express";
import identifyInput from "../types/identifyRequest";

const identityRouter = Router();

function identityHandler(req: Request, res: Response) {
    console.log("[ii] Hit /identity with POST");
    let reqInput: identifyInput = {
        email: req.body?.email ?? "",
        phone: req.body?.phone ?? ""
    };
    console.log("[ii] Body from request " + reqInput);
    res.sendStatus(200);
}

function showHelp(_: Request, res: Response) {
    console.log("[ii] Hit /identity with GET");
    res.send("You have to use POST method for this");
}

identityRouter.post("/", identityHandler);
identityRouter.get("/", showHelp);

export default identityRouter;
