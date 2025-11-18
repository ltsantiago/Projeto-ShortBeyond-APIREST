// @ts-nocheck
import { test, expect } from "@playwright/test";
import { authService } from "../../support/services/auth";
import { createUser } from "../../support/factories/user";

test.describe("POST/auth/login", () => {
  let auth;

  test.beforeEach(({ request }) => {
    auth = authService(request);
  });

  test("Deve autenticar um usuário com sucesso", async () => {
    //Gera massa de dados
    const user = createUser();

    //Pré-condição: cadastrar o usuário
    const respCreate = await auth.newRegister(user);
    expect(respCreate.status()).toBe(201);

    //Ação: autenticar o usuário
    const response = await auth.login(user);
    expect(response.status()).toBe(200);

    //Verificações
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty(
      "message",
      "Login realizado com sucesso"
    );
    expect(responseBody.data).toHaveProperty("token");
    expect(responseBody.data.user).toHaveProperty("id");
    expect(responseBody.data.user).toHaveProperty("name", user.name);
    expect(responseBody.data.user).toHaveProperty("email", user.email);
    expect(responseBody.data.user).not.toHaveProperty("password");
  });

  test(" Não deve logar com a senha incorreta", async () => {
    //Gera massa de dados
    const user = createUser();

    //Pré-condição: cadastrar o usuário
    const respCreate = await auth.newRegister(user);
    expect(respCreate.status()).toBe(201);

    //Ação: autenticar o usuário
    const response = await auth.login({ ...user, password: "senhaerrada" });
    expect(response.status()).toBe(401);

    //Verificações
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty("message", "Credenciais inválidas");
  });

  test(" Não deve logar com a email que não foi cadastrado", async () => {
    const user = {
      email: "404@lucasdev.com",
      password: "luc123",
    };
    //Ação: autenticar o usuário
    const response = await auth.login({ ...user, password: "senhaerrada" });
    expect(response.status()).toBe(401);

    //Verificações
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty("message", "Credenciais inválidas");
  });

  test(" Não deve logar com campo email vazio", async () => {
    const user = {
      email: "",
      password: "luc123",
    };
    //Ação: autenticar o usuário
    const response = await auth.login(user);
    expect(response.status()).toBe(400);

    //Verificações
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Email' é obrigatório"
    );
  });

  test(" Não deve logar com campo senha vazio", async () => {
    const user = {
      email: "lucas@lucas.dev.com",
      password: "",
    };
    //Ação: autenticar o usuário
    const response = await auth.login(user);
    expect(response.status()).toBe(400);

    //Verificações
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Password' é obrigatório"
    );
  });
});
