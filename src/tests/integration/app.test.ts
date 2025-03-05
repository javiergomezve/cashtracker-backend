import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";

describe("Create account", () => {
    beforeAll(async () => {
        await connectDB();
    });

    it("should return validation errors when form is empty", async () => {
        const res = await request(server).post("/api/v1/auth/create-account").send({});

        const createAccountMock = jest.spyOn(AuthController, "createAccount");

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toHaveLength(4);
        expect(createAccountMock).not.toHaveBeenCalled();
    });

    it("should return an 400 statusCode when the email is invalid", async () => {
        const res = await request(server).post("/api/v1/auth/create-account").send({
            firstName: "John",
            lastName: "Doe",
            password: "12345678",
            email: "johndoe.com",
        });

        const createAccountMock = jest.spyOn(AuthController, "createAccount");

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0].path).toEqual("email");
        expect(res.body.errors).toHaveLength(1);
        expect(createAccountMock).not.toHaveBeenCalled();
    });

    it("should return an 400 statusCode when the password is less than 8 characters", async () => {
        const res = await request(server).post("/api/v1/auth/create-account").send({
            firstName: "John",
            lastName: "Doe",
            password: "1234567",
            email: "john@doe.com",
        });

        const createAccountMock = jest.spyOn(AuthController, "createAccount");

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0].path).toEqual("password");
        expect(res.body.errors).toHaveLength(1);
        expect(createAccountMock).not.toHaveBeenCalled();
    });

    it("should return an 201 statusCode when the user data is correct", async () => {
        const userData = {
            firstName: "John",
            lastName: "Doe",
            password: "12345678",
            email: "john@doe.com",
        };
        const res = await request(server).post("/api/v1/auth/create-account").send(userData);

        expect(res.statusCode).toBe(201);
        expect(res.body).not.toHaveProperty("errors");
    });

    it("should return an 409 statusCode when the email is already registered", async () => {
        const userData = {
            firstName: "John",
            lastName: "Doe",
            password: "12345678",
            email: "john@doe.com",
        };
        const res = await request(server).post("/api/v1/auth/create-account").send(userData);

        expect(res.statusCode).toBe(409);
        expect(res.body).toEqual({ error: "User already exists" });
    });
});
