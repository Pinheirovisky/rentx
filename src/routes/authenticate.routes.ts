import { AuthenticateUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { Router } from "express";

const authenticateRoutes = Router();

const authenticateUserControler = new AuthenticateUserController();

authenticateRoutes.post("/sessions", authenticateUserControler.handle);

export { authenticateRoutes };
