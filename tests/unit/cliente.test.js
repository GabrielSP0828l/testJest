const { carregarApp, $, preencherCliente } = require("../helpers/setup");

describe("Testes de Cliente", () => {
  let app;
  beforeEach(() => { app = carregarApp(); });

  test("1. Deve permitir criar cliente com nome válido", () => {
    preencherCliente({ nome: "Maria Silva", email: "maria@email.com" });
    app.criarCliente();

    expect(app.clientes).toHaveLength(1);
    expect(app.clientes[0].nome).toBe("Maria Silva");
    expect(window.alert).not.toHaveBeenCalled();
  });

  test("2. Não deve permitir cliente com nome vazio", () => {
    preencherCliente({ nome: "", email: "maria@email.com" });
    app.criarCliente();

    expect(app.clientes).toHaveLength(0);
    expect(window.alert).toHaveBeenCalledWith("Nome inválido");
  });

  test("2b. Não deve permitir cliente com nome só de espaços", () => {
    preencherCliente({ nome: "   ", email: "maria@email.com" });
    app.criarCliente();

    expect(app.clientes).toHaveLength(0);
  });

  test("3. Deve permitir cadastrar cliente com email válido", () => {
    preencherCliente({ nome: "João", email: "joao@petshop.com.br" });
    app.criarCliente();

    expect(app.clientes).toHaveLength(1);
    expect(app.clientes[0].email).toBe("joao@petshop.com.br");
    expect($("listaClientes").textContent).toContain("joao@petshop.com.br");
  });

  test("4. Não deve permitir email inválido (sem @)", () => {
    preencherCliente({ nome: "João", email: "joaoemail.com" });
    app.criarCliente();

    expect(app.clientes).toHaveLength(0);
    expect(window.alert).toHaveBeenCalledWith("Email inválido");
  });

  test.each(["@", "joao@", "@email.com", "joao@email", "joao @email.com", ""])(
    "4b. Não deve permitir email malformado: '%s'",
    (email) => {
      preencherCliente({ nome: "João", email });
      app.criarCliente();

      expect(app.clientes).toHaveLength(0);
    }
  );

  test("5. Deve permitir marcar cliente como VIP", () => {
    preencherCliente({ nome: "Ana", email: "ana@email.com", vip: true });
    app.criarCliente();

    expect(app.clientes[0].vip).toBe(true);
  });

  test("5b. Cliente sem marcar VIP não deve ser VIP", () => {
    preencherCliente({ nome: "Ana", email: "ana@email.com", vip: false });
    app.criarCliente();

    expect(app.clientes[0].vip).toBe(false);
  });
});
