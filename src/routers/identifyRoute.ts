import { Request, Response, Router } from "express";
import identifyInput from "../types/identifyRequest";
import identifyUser from "../services/identifyUser";

const identityRouter = Router();

async function identityHandler(req: Request, res: Response) {
    console.log("[ii] Hit /identity with POST");
    let reqInput: identifyInput = {
        email: req.body?.email ?? "",
        phone: req.body?.phone ?? ""
    };
    console.log("[ii] Body from request " + reqInput);

    let retResponse = await identifyUser(reqInput);

    res.send(JSON.stringify(retResponse));
}

function showHelp(_: Request, res: Response) {
    console.log("[ii] Hit /identity with GET");
    res.send("You have to use POST method for this");
}

identityRouter.post("/", identityHandler);
identityRouter.get("/", showHelp);

export default identityRouter;
