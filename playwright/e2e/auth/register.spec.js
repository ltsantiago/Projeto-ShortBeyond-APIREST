// @ts-check
import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createUser } from "../../support/factories/user.js";
import { registerService } from "../../support/services/register.js";

test.describe("POST/auth/register", () => {
  
// Hooks para rodar primeito
  let register;
  test.beforeEach(({request}) => {
    register = registerService(request);
  });


  test("Deve registrar um novo usuário com sucesso", async ({ request }) => {

    // preparação massa de teste
    const user = createUser();

    // Envia a requisição POST para registrar o usuário
    const response = await register.newRegister(user);

    // Verifica se o status da resposta é 201 (Created)
    expect(response.status()).toBe(201);
    const responseBody = await response.json();

    // Verifica se o corpo da resposta contém as propriedades esperadas
    expect(responseBody.user).toHaveProperty("id");
    expect(responseBody.user).toHaveProperty("name", user.name);
    expect(responseBody.user).toHaveProperty("email", user.email);
    expect(responseBody).toHaveProperty(
      "message",
      "Usuário cadastrado com sucesso!"
    );
    expect(responseBody.user).not.toHaveProperty("password");
  });

  test("Não Deve registrar um novo usuário com email já em uso", async ({
    request,
  }) => {
    const register = registerService(request);
    const user = createUser();

    // Envia a requisição POST para registrar o usuário
    const preConditions = await register.newRegister(user);

    // Verifica se o status da resposta é 201
    expect(preConditions.status()).toBe(201);

    const response = await register.newRegister(user);

    // Verifica se o status da resposta é 400
    expect(response.status()).toBe(400);
    const responseBody = await response.json();

    // Verifica se o corpo da resposta contém as propriedades esperadas
    expect(responseBody).toHaveProperty(
      "message",
      "Este e-mail já está em uso. Por favor, tente outro."
    );
  });

  test("Não Deve registrar um novo usuário com campo email incorreto", async ({
    request,
  }) => {

    const register = registerService(request);

    //Massa de teste
    const user = {
      name: "Lucas Silva",
      email: "lucas&lucas.dev.com",
      password: "luc123",
    };

    const response = await register.newRegister(user);

    // Verifica se o status da resposta é 400
    expect(response.status()).toBe(400);
    const responseBody = await response.json();

    // Verifica se o corpo da resposta contém as propriedades esperadas
    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Email' deve ser um email válido"
    );
  });

  test("Não Deve registrar um novo usuário com campo password em branco", async ({
    request,
  }) => {

    const register = registerService(request);

    //Massa de teste
    const user = {
      name: "Lucas Silva",
      email: "lucas&lucas.dev.com",
      password: "",
    };

    const response = await register.newRegister(user);

    // Verifica se o status da resposta é 400
    expect(response.status()).toBe(400);
    const responseBody = await response.json();

    // Verifica se o corpo da resposta contém as propriedades esperadas
    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Email' deve ser um email válido"
    );
  });

  test("Não Deve registrar um novo usuário com campo Email em branco", async ({
    request,
  }) => {

    const register = registerService(request);

    //Massa de teste
    const user = {
      name: "Lucas Silva",
      email: "",
      password: "luc123",
    };

    const response = await register.newRegister(user);

    // Verifica se o status da resposta é 400
    expect(response.status()).toBe(400);
    const responseBody = await response.json();

    // Verifica se o corpo da resposta contém as propriedades esperadas
    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Email' é obrigatório"
    );
  });

  test("Não Deve registrar um novo usuário com campo Name em branco", async ({
    request,
  }) => {

    const register = registerService(request);

    //Massa de teste
    const user = {
      email: "lucas&lucas.dev.com",
      password: "luc123",
    };

    const response = await register.newRegister(user);

    // Verifica se o status da resposta é 400
    expect(response.status()).toBe(400);
    const responseBody = await response.json();

    // Verifica se o corpo da resposta contém as propriedades esperadas
    expect(responseBody).toHaveProperty(
      "message",
      "O campo 'Name' é obrigatório"
    );
  });
});
