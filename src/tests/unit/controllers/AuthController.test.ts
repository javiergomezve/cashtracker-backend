import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
import { hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import mock = jest.mock;

// automatically apply mocks to all functions
jest.mock("../../../models/User");
jest.mock("../../../utils/auth");
jest.mock("../../../utils/token");

describe("AuthController.createAccount", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return an 409 statusCode and an error message if email is already registered", async () => {
        (User.findOne as jest.Mock).mockResolvedValue(true);

        const req = createRequest({
            method: "POST",
            url: "/api/v1/auth/create-account",
            body: { email: "test@example.com", password: "test" },
        });
        const res = createResponse();

        await AuthController.createAccount(req, res);

        expect(res.statusCode).toBe(409);
        expect(res._getJSONData()).toHaveProperty("error", "User already exists");
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    });

    it("should register a new user and return a success message", async () => {
        const req = createRequest({
            method: "POST",
            url: "/api/v1/auth/create-account",
            body: { email: "test@example.com", password: "test", firstName: "Test" },
        });
        const res = createResponse();

        const mockUser = {
            ...req.body,
            save: jest.fn(),
        };

        (User.create as jest.Mock).mockResolvedValue(mockUser); // mockResolvedValue is for async operations
        (mockUser.save as jest.Mock).mockResolvedValue(mockUser); // mockResolvedValue is for async operations
        (hashPassword as jest.Mock).mockResolvedValue("hashed-password"); // mockResolvedValue is for async operations
        (generateToken as jest.Mock).mockReturnValue("123456"); // mockReturnValue is for sync operations

        jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());

        await AuthController.createAccount(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual("account created");
        expect(User.create).toHaveBeenCalledWith(req.body);
        expect(mockUser.save).toHaveBeenCalledTimes(1);
        expect(hashPassword).toHaveBeenCalledTimes(1);
        expect(hashPassword).toHaveBeenCalledWith(req.body.password);
        expect(mockUser.password).toEqual("hashed-password");
        expect(generateToken).toHaveBeenCalledTimes(1);
        expect(mockUser.token).toEqual("123456");
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1);
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            firstName: mockUser.firstName,
            email: mockUser.email,
            token: mockUser.token,
        });
    });
});
