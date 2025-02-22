import { budgets } from "../mocks/budgets";
import { createRequest, createResponse } from "node-mocks-http";
import { BudgetController } from "../../controllers/BudgetController";
import Budget from "../../models/Budget";

jest.mock("../../models/Budget", () => ({
    findAll: jest.fn(),
    create: jest.fn(),
}));

describe("BudgetController.getAll", () => {
    beforeEach(async () => {
        (Budget.findAll as jest.Mock).mockReset();

        (Budget.findAll as jest.Mock).mockImplementation((options) => {
            const userBudgets = budgets.filter((budget) => budget.userId === options.where.userId);

            return Promise.resolve(userBudgets);
        });
    });

    it("should retrieve 2 budgets for user with id 1", async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/v1/budgets",
            user: { id: 1 },
        });

        const res = createResponse();

        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(2);
        expect(res.statusCode).toBe(200);
    });

    it("should retrieve 1 budget for user with id 2", async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/v1/budgets",
            user: { id: 2 },
        });

        const res = createResponse();

        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(1);
        expect(res.statusCode).toBe(200);
    });

    it("should retrieve 0 budget for user with id 3", async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/v1/budgets",
            user: { id: 3 },
        });

        const res = createResponse();

        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(0);
        expect(res.statusCode).toBe(200);
    });

    it("should handle errors when fetching budgets", async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/v1/budgets",
            user: { id: 4 },
        });

        const res = createResponse();

        (Budget.findAll as jest.Mock).mockRejectedValue(new Error());

        await BudgetController.getAll(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: "somenthing went wrong" });
    });
});

describe("BudgetController.create", () => {
    it("should create a new budget and response statusCode 201", async () => {
        const mockBudget = {
            save: jest.fn().mockResolvedValue(true),
        };
        (Budget.create as jest.Mock).mockResolvedValue(mockBudget);

        const req = createRequest({
            method: "POST",
            url: "/api/v1/budgets",
            user: { id: 1 },
            body: {
                name: "Budget test",
                amount: 1000,
            },
        });

        const res = createResponse();

        await BudgetController.create(req, res);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(201);
        expect(data).toEqual({ message: "budget created" });
        expect(mockBudget.save).toHaveBeenCalledTimes(1);
        expect(Budget.create).toHaveBeenCalledWith(req.body);
        expect(Budget.create).toHaveBeenCalledTimes(1);
    });

    it("should response statusCode 500 when budget creation fails", async () => {
        const mockBudget = {
            save: jest.fn().mockResolvedValue(true),
        };
        (Budget.create as jest.Mock).mockRejectedValue(new Error());

        const req = createRequest({
            method: "POST",
            url: "/api/v1/budgets",
            user: { id: 1 },
            body: {
                name: "Budget test",
                amount: 1000,
            },
        });

        const res = createResponse();

        await BudgetController.create(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: "somenthing went wrong" });
        expect(mockBudget.save).not.toHaveBeenCalled();
    });
});
