const { carregarApp, $, preencherProduto } = require("../helpers/setup");

describe("Testes de Produto", () => {
  let app;
  beforeEach(() => { app = carregarApp(); });

  test("10. Deve permitir criar produto com nome", () => {
    preencherProduto({ nome: "Ração Premium", preco: "50" });
    app.criarProduto();

    expect(app.produtos).toEqual([{ nome: "Ração Premium", preco: 50 }]);
  });

  test("10b. Não deve permitir criar produto sem nome", () => {
    preencherProduto({ nome: "", preco: "50" });
    app.criarProduto();

    expect(app.produtos).toHaveLength(0);
  });

  test("11. Produto deve possuir preço maior que zero", () => {
    preencherProduto({ nome: "Bola", preco: "0.01" });
    app.criarProduto();
    expect(app.produtos).toHaveLength(1);

    preencherProduto({ nome: "Osso", preco: "0" });
    app.criarProduto();
    expect(app.produtos).toHaveLength(1); // preço 0 é rejeitado
  });

  test("11b. Não deve permitir preço vazio ou não numérico", () => {
    preencherProduto({ nome: "Bola", preco: "" });
    app.criarProduto();
    preencherProduto({ nome: "Bola", preco: "abc" });
    app.criarProduto();

    expect(app.produtos).toHaveLength(0);
  });

  test("12. Produto não pode possuir preço negativo", () => {
    preencherProduto({ nome: "Coleira", preco: "-10" });
    app.criarProduto();

    expect(app.produtos).toHaveLength(0);
    expect(window.alert).toHaveBeenCalledWith("Preço inválido");
  });

  test("13. Produto deve aparecer na lista de produtos cadastrados", () => {
    preencherProduto({ nome: "Shampoo", preco: "25.5" });
    app.criarProduto();
    preencherProduto({ nome: "Escova", preco: "15" });
    app.criarProduto();

    const itens = [...$("listaProdutos").querySelectorAll("li")].map((li) => li.textContent);
    expect(itens).toEqual(["Shampoo - R$ 25.5", "Escova - R$ 15"]);
  });

  test("13b. Produto cadastrado deve aparecer no select do carrinho", () => {
    preencherProduto({ nome: "Shampoo", preco: "25" });
    app.criarProduto();

    const opcoes = [...$("produtoSelect").options].map((o) => o.textContent);
    expect(opcoes).toEqual(["Shampoo"]);
  });
});
