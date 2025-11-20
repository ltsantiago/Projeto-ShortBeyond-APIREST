import { test, expect } from "@playwright/test";
import { authService } from "../../support/services/auth";
import { linksService } from "../../support/services/links";
import { getUserWithLInk } from "../../support/factories/user";
import { request } from "http";
import { title } from "process";

test.describe("POST /links", () => {
  const user = getUserWithLInk(request);

  let link;
  let auth;
  let token;

  test.beforeEach(async ({ request }) => {
    auth = authService(request);
    link = linksService(request);
    await auth.newRegister(user);
    token = await auth.getToken(user);
  });

  test("Deve encutar um novo link", async ({ request }) => {
    const response = await link.createLink(user.link, token);

    expect(response.status()).toBe(201);
    const { data, message } = await response.json();

    expect(message).toBe("Link criado com sucesso");
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("original_url", user.link.original_url);
    expect(data).toHaveProperty("title", user.link.title);
    expect(data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
  });

  test("Não deve encurtar quando a url original não é informada", async ({
    request,
  }) => {
   
    const response = await link.createLink(
      { ...user.link, original_url: "" },
      token
    );

    expect(response.status()).toBe(400);
    const { message } = await response.json();
    expect(message).toBe("O campo 'OriginalURL' é obrigatório");
  });

  test("Não deve encurtar quando O título não é informado", async ({
    request,
  }) => {
  
    const response = await link.createLink({ ...user.link, title: "" }, token);

    expect(response.status()).toBe(400);
    const { message } = await response.json();
    expect(message).toBe("O campo 'Title' é obrigatório");
  });

  test("Não deve encurtar quando a url original é inválida", async ({
    request,
  }) => {
  
    const response = await link.createLink(
      { ...user.link, original_url: "teste@teste.com" },
      token
    );

    expect(response.status()).toBe(400);
    const { message } = await response.json();
    expect(message).toBe("O campo 'OriginalURL' deve ser uma URL válida");
  });
});
