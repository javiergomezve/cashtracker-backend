import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
import { checkPassword, hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJWT } from "../../../utils/jwt";

// automatically apply mocks to all functions
jest.mock("../../../models/User");
jest.mock("../../../utils/auth");
jest.mock("../../../utils/token");
jest.mock("../../../utils/jwt");

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

describe("AuthController.login", () => {
    it("should return 400 if user is not found", async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const req = createRequest({
            method: "POST",
            url: "/api/v1/auth/login",
            body: { email: "test@example.com", password: "test" },
        });
        const res = createResponse();

        await AuthController.login(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toHaveProperty("error", "Invalid user");
    });

    it("should return 403 if user has not confirmed his account", async () => {
        const req = createRequest({
            method: "POST",
            url: "/api/v1/auth/login",
            body: { email: "test@example.com", password: "test" },
        });
        const res = createResponse();

        const mockUser = {
            ...req.body,
            confirmed: false,
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);

        await AuthController.login(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toHaveProperty("error", "Account is not confirmed");
    });

    it("should return 401 if password is incorrect", async () => {
        const req = createRequest({
            method: "POST",
            url: "/api/v1/auth/login",
            body: { email: "test@example.com", password: "test-01" },
        });
        const res = createResponse();

        const mockUser = {
            ...req.body,
            password: "test",
            confirmed: true,
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (checkPassword as jest.Mock).mockResolvedValue(false);

        await AuthController.login(req, res);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toHaveProperty("error", "Invalid password");
        expect(checkPassword).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith(req.body.password, mockUser.password);
    });

    it("should return a JWT if auth is successful", async () => {
        const req = createRequest({
            method: "POST",
            url: "/api/v1/auth/login",
            body: { email: "test@example.com", password: "test" },
        });
        const res = createResponse();

        const mockUser = {
            ...req.body,
            id: 1,
            password: "test",
            confirmed: true,
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        const jwt = "010203";
        (generateJWT as jest.Mock).mockReturnValue(jwt);

        await AuthController.login(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(jwt);
        expect(generateJWT).toHaveBeenCalledTimes(1);
        expect(generateJWT).toHaveBeenCalledWith(mockUser.id);
    });
});
