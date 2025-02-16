import type { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
    static async index(req: Request, res: Response) {}

    static async store(req: Request, res: Response) {
        try {
            const expense = new Expense(req.body);
            expense.budgetId = req.budget.id;
            await expense.save();
            res.status(201).json("created successfully");
        } catch (error) {
            res.status(500).json("Somenthing wet wrong");
        }
    }

    static async show(req: Request, res: Response) {}

    static async update(req: Request, res: Response) {}

    static async destroy(req: Request, res: Response) {}
}
