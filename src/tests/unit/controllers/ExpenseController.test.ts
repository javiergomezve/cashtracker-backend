import Expense from "../../../models/Expense";
import { createRequest, createResponse } from "node-mocks-http";
import { ExpenseController } from "../../../controllers/ExpenseController";

jest.mock("../../../models/Expense", () => ({
    create: jest.fn(),
}));

describe("ExpenseController.store", () => {
    it("should create a new expense", async () => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true),
        };
        (Expense.create as jest.Mock).mockResolvedValue(expenseMock);

        const req = createRequest({
            method: "POST",
            url: "/api/v1/budgets/:budgetId/expenses",
            body: { name: "Test expense", amount: 3000 },
            budget: { id: 1 },
        });
        const res = createResponse();
        await ExpenseController.store(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual("created successfully");
        expect(expenseMock.save).toHaveBeenCalledTimes(1);
    });

    it("should handle expense creation error", async () => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true),
        };
        (Expense.create as jest.Mock).mockRejectedValue(expenseMock);

        const req = createRequest({
            method: "POST",
            url: "/api/v1/budgets/:budgetId/expenses",
            body: { name: "Test expense", amount: 3000 },
            budget: { id: 1 },
        });
        const res = createResponse();
        await ExpenseController.store(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual("Something went wrong");
        expect(expenseMock.save).not.toHaveBeenCalled();
    });
});
