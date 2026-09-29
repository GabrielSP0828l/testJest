const { carregarApp, $, cadastrarEAdicionar, preencherProduto } = require("../helpers/setup");

describe("Testes de Carrinho", () => {
  let app;
  beforeEach(() => { app = carregarApp(); });

  test("14. Deve permitir adicionar produto ao carrinho", () => {
    cadastrarEAdicionar(app, "Ração", 40);

    expect(app.carrinho).toHaveLength(1);
    expect(app.carrinho[0]).toEqual({ nome: "Ração", preco: 40 });
  });

  test("14b. Adicionar sem nenhum produto cadastrado não deve quebrar", () => {
    expect(() => app.adicionarCarrinho()).not.toThrow();
    expect(app.carrinho).toHaveLength(0);
  });

  test("15. Deve permitir remover produto do carrinho", () => {
    cadastrarEAdicionar(app, "Ração", 40);
    cadastrarEAdicionar(app, "Bola", 10);
    app.removerCarrinho();

    expect(app.carrinho).toHaveLength(1);
  });

  test("15b. Remover com carrinho vazio não deve quebrar", () => {
    expect(() => app.removerCarrinho()).not.toThrow();
    expect(app.carrinho).toHaveLength(0);
  });

  test("16. Carrinho deve listar todos os produtos adicionados", () => {
    cadastrarEAdicionar(app, "Ração", 40);
    cadastrarEAdicionar(app, "Bola", 10);
    cadastrarEAdicionar(app, "Coleira", 20);

    const itens = [...$("listaCarrinho").querySelectorAll("li")].map((li) => li.textContent);
    expect(itens).toHaveLength(3);
    expect(itens.join("|")).toContain("Ração");
    expect(itens.join("|")).toContain("Bola");
    expect(itens.join("|")).toContain("Coleira");
  });

  test("17. Carrinho deve calcular o valor total da compra", () => {
    cadastrarEAdicionar(app, "Ração", 40);
    cadastrarEAdicionar(app, "Bola", 10.5);

    expect(Number(app.calcularTotal())).toBeCloseTo(50.5, 2);
    expect($("total").textContent).toBe("50.50");
  });

  test("17b. Total deve ser atualizado ao remover produto", () => {
    cadastrarEAdicionar(app, "Ração", 40);
    cadastrarEAdicionar(app, "Bola", 10);
    app.removerCarrinho();

    expect(Number($("total").textContent)).toBeGreaterThanOrEqual(0);
    expect(app.carrinho).toHaveLength(1);
  });

  test("20. Carrinho não deve aceitar produto com preço igual a zero", () => {
    // Produto com preço 0 inserido diretamente na lista (contorna a validação do cadastro)
    app.produtos.push({ nome: "Brinde", preco: 0 });
    app.renderProdutos();
    $("produtoSelect").value = "0";
    app.adicionarCarrinho();

    expect(app.carrinho).toHaveLength(0);
  });

  test("20b. Produto com preço 0 criado pelo formulário não chega ao carrinho", () => {
    preencherProduto({ nome: "Brinde", preco: "0" });
    app.criarProduto();
    if (app.produtos.length) {
      $("produtoSelect").value = "0";
      app.adicionarCarrinho();
    }

    expect(app.carrinho).toHaveLength(0);
  });
});
