import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

export const authRouter = Router();

authRouter.post(
    "/create-account",
    body("firstName").notEmpty().withMessage("first name is required"),
    body("lastName").notEmpty().withMessage("first name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Invalid password"),
    handleInputErrors,
    AuthController.createAccount,
);

authRouter.post(
    "/confirm-account",
    body("token").isLength({min: 6, max: 6}).withMessage("Invalid token"),
    handleInputErrors,
    AuthController.confirmAccount,
);