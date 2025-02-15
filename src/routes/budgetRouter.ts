import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.get("/", handleInputErrors, BudgetController.getAll);
router.post(
    "/",
    body("name").notEmpty().withMessage("Name is required"),
    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount invalid")
        .custom((value) => value > 0)
        .withMessage("Amount invalid"),
    BudgetController.create,
);
router.get(
    "/:id",
    param("id")
        .isInt()
        .withMessage("id is invalid")
        .custom((value) => value > 0)
        .withMessage("id is invalid"),
    handleInputErrors,
    BudgetController.findById,
);
router.put(
    "/:id",
    param("id")
        .isInt()
        .withMessage("id is invalid")
        .custom((value) => value > 0)
        .withMessage("id is invalid"),
    body("name").notEmpty().withMessage("Name is required"),
    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount invalid")
        .custom((value) => value > 0)
        .withMessage("Amount invalid"),
    handleInputErrors,
    BudgetController.update,
);
router.delete(
    "/:id",
    param("id")
        .isInt()
        .withMessage("id is invalid")
        .custom((value) => value > 0)
        .withMessage("id is invalid"),
    handleInputErrors,
    BudgetController.delete,
);

export default router;
