import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../../app";
import { knex } from "../../lib/knex";

describe("e2e tests", () => {
  beforeEach(() => {
    execSync("npx knex migrate:rollback");
    execSync("npx knex migrate:latest");
  });

  afterAll(() => {
    const server = app.listen(3562, () => {
      knex.destroy();
      server.close();
    });
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "fake user",
      email: "fake@test.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });

  it("Should be able to create a user session", async () => {
    await request(app).post("/users").send({
      name: "fake user",
      email: "fake@test.com",
      password: "123456",
    });

    const response = await request(app).post("/users/sessions").send({
      email: "fake@test.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.token).toBeTruthy();
  });

  it("Should be able to create a transaction", async () => {
    await request(app).post("/users").send({
      name: "fake user",
      email: "fake@test.com",
      password: "123456",
    });

    const sessionReponse = await request(app).post("/users/sessions").send({
      email: "fake@test.com",
      password: "123456",
    });

    const token = sessionReponse.body.token;

    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 100,
        type: "credit",
        description: "fake transaction",
      });

    expect(response.statusCode).toEqual(201);
  });

  it("Should be able to update a transaction", async () => {
    await request(app).post("/users").send({
      name: "fake user",
      email: "fake@test.com",
      password: "123456",
    });

    const sessionReponse = await request(app).post("/users/sessions").send({
      email: "fake@test.com",
      password: "123456",
    });

    const token = sessionReponse.body.token;

    const newTransactionResponse = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 100,
        type: "credit",
        description: "fake transaction",
      });

    const response = await await request(app)
      .put(`/transactions/${newTransactionResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 150,
      });

    expect(response.statusCode).toEqual(204);
  });

  it("Should be able to delete a transaction", async () => {
    await request(app).post("/users").send({
      name: "fake user",
      email: "fake@test.com",
      password: "123456",
    });

    const sessionReponse = await request(app).post("/users/sessions").send({
      email: "fake@test.com",
      password: "123456",
    });

    const token = sessionReponse.body.token;

    const newTransactionResponse = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 100,
        type: "credit",
        description: "fake transaction",
      });

    const response = await await request(app)
      .delete(`/transactions/${newTransactionResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);
  });

  it("Should be able to list a user transactions", async () => {
    await request(app).post("/users").send({
      name: "fake user",
      email: "fake@test.com",
      password: "123456",
    });

    const sessionReponse = await request(app).post("/users/sessions").send({
      email: "fake@test.com",
      password: "123456",
    });

    const token = sessionReponse.body.token;

    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 100,
        type: "credit",
        description: "fake transaction",
      });

    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.transactions).toHaveLength(1);
  });

  it("Should be able to get a user balance", async () => {
    await request(app).post("/users").send({
      name: "fake user",
      email: "fake@test.com",
      password: "123456",
    });

    const sessionReponse = await request(app).post("/users/sessions").send({
      email: "fake@test.com",
      password: "123456",
    });

    const token = sessionReponse.body.token;

    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 100,
        type: "credit",
        description: "fake transaction",
      });

    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 80,
        type: "debt",
        description: "fake transaction",
      });

    const response = await request(app)
      .get("/transactions/balance")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.balance).toEqual(20);
  });
});
