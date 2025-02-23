import type { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
    static async index(req: Request, res: Response) {}

    static async store(req: Request, res: Response) {
        try {
            const expense = await Expense.create(req.body);
            expense.budgetId = req.budget.id;
            await expense.save();
            res.status(201).json("created successfully");
        } catch (error) {
            res.status(500).json("Something went wrong");
        }
    }

    static async show(req: Request, res: Response) {
        res.json(req.expense);
    }

    static async update(req: Request, res: Response) {
        try {
            await req.expense.update(req.body);
            res.json("updated successfully");
        } catch (error) {
            res.status(500).json("Something went wrong");
        }
    }

    static async destroy(req: Request, res: Response) {
        try {
            await req.expense.destroy();
            res.status(204).json("deleted successfully");
        } catch (error) {
            res.status(500).json("Something went wrong");
        }
    }
}
