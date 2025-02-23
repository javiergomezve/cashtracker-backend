import { budgets } from "../mocks/budgets";
import { createRequest, createResponse } from "node-mocks-http";
import { BudgetController } from "../../controllers/BudgetController";
import Budget from "../../models/Budget";
import Expense from "../../models/Expense";

jest.mock("../../models/Budget", () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
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

describe("BudgetController.findById", () => {
    beforeEach(() => {
        (Budget.findByPk as jest.Mock).mockReset();
        (Budget.findByPk as jest.Mock).mockImplementation((id) => {
            const index = budgets.findIndex((b) => b.id === id);
            return Promise.resolve(budgets[index]);
        });
    });

    it("should return a budget with ID 1 & 3 expenses", async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/v1/budgets/:id",
            budget: { id: 1 },
        });
        const res = createResponse();
        await BudgetController.findById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(3);
        expect(Budget.findByPk).toHaveBeenCalledTimes(1);
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
            include: [Expense],
        });
    });

    it("should return a budget with ID 2 & 2 expenses", async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/v1/budgets/:id",
            budget: { id: 2 },
        });
        const res = createResponse();
        await BudgetController.findById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(2);
        expect(Budget.findByPk).toHaveBeenCalledTimes(1);
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
            include: [Expense],
        });
    });

    it("should return a budget with ID 3 & 0 expenses", async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/v1/budgets/:id",
            budget: { id: 3 },
        });
        const res = createResponse();
        await BudgetController.findById(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(0);
        expect(Budget.findByPk).toHaveBeenCalledTimes(1);
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
            include: [Expense],
        });
    });
});

describe("BudgetController.update", () => {
    it("should update the budget and return a success message", async () => {
        const budgetMock = {
            update: jest.fn().mockResolvedValue(true),
        };

        const req = createRequest({
            method: "PUT",
            url: "/api/v1/budgets/:budgetId",
            budget: budgetMock,
            body: { name: "Budget updated", amount: 4000 },
        });
        const res = createResponse();
        await BudgetController.update(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toBe("budget updated");
        expect(budgetMock.update).toHaveBeenCalledTimes(1);
        expect(budgetMock.update).toHaveBeenCalledWith(req.body);
    });
});
