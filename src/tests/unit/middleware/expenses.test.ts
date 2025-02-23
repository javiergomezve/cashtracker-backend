import Expense from "../../../models/Expense";
import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExists } from "../../../middleware/expense";
import { expenses } from "../../mocks/expenses";

jest.mock("../../../models/Expense", () => ({
    findByPk: jest.fn(),
}));

describe("Expenses middleware - validateExpenseExists", () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.find((e) => e.id === id);
            if (!expense) return Promise.resolve(null);
            return Promise.resolve(expense);
        });
    });

    it("should handle a non-existing budget", async () => {
        const req = createRequest({
            params: { expenseId: 120 },
        });
        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({ error: "Expense not found" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should handle an existing budget", async () => {
        const req = createRequest({
            params: { expenseId: 1 },
        });
        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next);

        expect(req.expense).toEqual(expenses[0]);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should return a statusCode 500 when fetching the expense fails", async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error());

        const req = createRequest({
            params: { expenseId: 1 },
        });
        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: "something went wrong" });
        expect(next).not.toHaveBeenCalled();
    });
});
