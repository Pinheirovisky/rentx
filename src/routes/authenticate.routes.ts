import { Router } from "express";
import { AuthenticateUserController } from "../modules/cars/accounts/useCases/authenticateUser/AuthenticateUserController";

const authenticateRoutes = Router();

const authenticateUserControler = new AuthenticateUserController();

authenticateRoutes.post("/sessions", authenticateUserControler.handle);

export { authenticateRoutes };
