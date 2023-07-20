import { Router } from "express";
import { categoriesRoutes } from "./categories.routes";
import { specificationsRoutes } from "./specification.routes";
import { usersRoutes } from "./users.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { carsRoutes } from "./cars.routes";
import { rentalRoutes } from "./rental.routes";

const router = Router();

router.use("/cars", carsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/rentals", rentalRoutes);
router.use("/specifications", specificationsRoutes);
router.use("/users", usersRoutes);

router.use(authenticateRoutes);

export { router };
