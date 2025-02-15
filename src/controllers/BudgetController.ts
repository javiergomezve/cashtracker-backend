import { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [["createdAt", "DESC"]],
                // TODO: add filter by user
            });
            res.json(budgets);
        } catch (e) {
            console.error("error: ", e);
            res.status(500).json({ error: "somenthing went wrong" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body);
            await budget.save();
            res.status(201).json({ message: "budget created" });
        } catch (e) {
            console.error("error: ", e);
            res.status(500).json({ error: "somenthing went wrong" });
        }
    };

    static findById = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findByPk(req.params.id);
            if (!budget) {
                const error = new Error("Budget not found");
                res.status(404).json({ error: error.message });
                return;
            }
            res.json(budget);
        } catch (e) {
            console.error("error: ", e);
            res.status(500).json({ error: "somenthing went wrong" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findByPk(req.params.id);
            if (!budget) {
                const error = new Error("Budget not found");
                res.status(404).json({ error: error.message });
                return;
            }

            await budget.update(req.body);

            res.json("budget updated");
        } catch (e) {
            console.error("error: ", e);
            res.status(500).json({ error: "somenthing went wrong" });
        }
    };

    static delete = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findByPk(req.params.id);
            if (!budget) {
                const error = new Error("Budget not found");
                res.status(404).json({ error: error.message });
                return;
            }

            await budget.destroy();

            res.json("budget deleted");
        } catch (e) {
            console.error("error: ", e);
            res.status(500).json({ error: "somenthing went wrong" });
        }
    };
}
