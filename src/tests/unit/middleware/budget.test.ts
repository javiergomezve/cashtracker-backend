import { createRequest, createResponse } from "node-mocks-http";
import { userHasAccessToBudget, validateBudgetExists } from "../../../middleware/budget";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocks/budgets";

jest.mock("../../../models/Budget", () => ({
    findByPk: jest.fn(),
}));

describe("budget middleware - validateBudgetExists", () => {
    it("should handle budget does not exists", async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null);

        const req = createRequest({
            params: {
                budgetId: 1,
            },
        });

        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req, res, next);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: "Budget not found" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return an 500 statusCode when budget query fails", async () => {
        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error());

        const req = createRequest({
            params: {
                budgetId: 1,
            },
        });

        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req, res, next);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: "something went wrong" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should continue to next middleware if budget exists", async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);

        const req = createRequest({
            params: {
                budgetId: 1,
            },
        });
        const res = createResponse();
        const next = jest.fn();
        await validateBudgetExists(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.budget).toEqual(budgets[0]);
    });
});

describe("budget middleware - userHasAccessToBudget", () => {
    it("should continue to next middleware if user has access to budget", () => {
        const req = createRequest({
            budget: budgets[0],
            user: { id: 1 },
        });
        const res = createResponse();
        const next = jest.fn();

        userHasAccessToBudget(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should return statusCode 401 if user dos not have access to budget", () => {
        const req = createRequest({
            budget: budgets[0],
            user: { id: 100 },
        });
        const res = createResponse();
        const next = jest.fn();

        userHasAccessToBudget(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
        expect(res._getJSONData()).toEqual({ error: "Invalid action" });
    });
});
