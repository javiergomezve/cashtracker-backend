import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

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
    body("token").isLength({ min: 6, max: 6 }).withMessage("Invalid token"),
    handleInputErrors,
    AuthController.confirmAccount,
);

authRouter.post(
    "/login",
    body("email").notEmpty().withMessage("Email required"),
    body("password").notEmpty().withMessage("Password required"),
    handleInputErrors,
    AuthController.login,
);

authRouter.post(
    "/forgot-password",
    body("email").notEmpty().withMessage("Email required"),
    handleInputErrors,
    AuthController.forgotPassword,
);

authRouter.post(
    "/validate-token",
    body("token").isLength({ min: 6, max: 6 }).withMessage("Invalid token"),
    handleInputErrors,
    AuthController.validateToken,
);

authRouter.post(
    "/reset-password/:token",
    param("token").isLength({ min: 6, max: 6 }).withMessage("Invalid token"),
    body("password").isLength({ min: 8 }).withMessage("Invalid password"),
    handleInputErrors,
    AuthController.resetPasswordWithToken,
);

authRouter.get(
    "/user",
    authenticate,
    AuthController.user,
);

authRouter.post(
    "/update-password",
    body("current_password").notEmpty().withMessage("Invalid password"),
    body("password").isLength({ min: 8 }).withMessage("Invalid password"),
    handleInputErrors,
    authenticate,
    AuthController.updateCurrentUserPassword,
);
