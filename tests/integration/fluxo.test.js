const { carregarApp, $, preencherCliente, preencherPet, preencherProduto } = require("../helpers/setup");

/** Testes de integração: usam os botões reais do index.html (onclick) e conferem o DOM. */
describe("Integração - fluxo completo pela interface", () => {
  let app;
  beforeEach(() => { app = carregarApp(); });

  const botao = (texto) => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === texto);

  test("Cadastrar cliente, pet e produto pelos botões atualiza as três listas", () => {
    preencherCliente({ nome: "Maria", email: "maria@email.com", vip: true });
    botao("Cadastrar").click();

    preencherPet({ nome: "Rex", tipo: "cachorro", idade: "4" });
    botao("Cadastrar Pet").click();

    preencherProduto({ nome: "Ração", preco: "80" });
    botao("Criar Produto").click();

    expect($("listaClientes").textContent).toContain("Maria - maria@email.com");
    expect($("listaPets").textContent).toContain("Rex (cachorro)");
    expect($("listaProdutos").textContent).toContain("Ração - R$ 80");
  });

  test("Compra completa: cadastrar produtos, adicionar, aplicar desconto e finalizar", () => {
    preencherProduto({ nome: "Ração", preco: "80" });
    botao("Criar Produto").click();
    preencherProduto({ nome: "Brinquedo", preco: "40" });
    botao("Criar Produto").click();

    $("produtoSelect").value = "0";
    botao("Adicionar").click();
    $("produtoSelect").value = "1";
    botao("Adicionar").click();

    expect($("listaCarrinho").children).toHaveLength(2);
    expect($("total").textContent).toBe("108.00"); // (80 + 40) = 120 -> 10% de desconto

    botao("Finalizar").click();

    expect(window.alert).toHaveBeenLastCalledWith("Compra finalizada: 108.00");
    expect($("listaCarrinho").children).toHaveLength(0);
    expect(Number($("total").textContent)).toBe(0);
  });

  test("Cliente VIP cadastrado pela interface recebe 15% na compra", () => {
    preencherCliente({ nome: "Ana", email: "ana@email.com", vip: true });
    botao("Cadastrar").click();
    preencherProduto({ nome: "Bola", preco: "100" });
    botao("Criar Produto").click();

    $("clienteSelect").value = "0";
    $("produtoSelect").value = "0";
    botao("Adicionar").click();

    expect($("total").textContent).toBe("85.00");
  });

  test("Cadastros inválidos pela interface exibem alerta e não alteram as listas", () => {
    preencherCliente({ nome: "", email: "x" });
    botao("Cadastrar").click();
    preencherProduto({ nome: "Coleira", preco: "-5" });
    botao("Criar Produto").click();

    expect(window.alert).toHaveBeenCalledTimes(2);
    expect($("listaClientes").children).toHaveLength(0);
    expect($("listaProdutos").children).toHaveLength(0);
  });
});

describe("Integração - botões Adicionar / Remover / Finalizar", () => {
  let app;
  beforeEach(() => {
    app = carregarApp();
    preencherProduto({ nome: "Ração", preco: "30" });
    app.criarProduto();
    preencherProduto({ nome: "Bola", preco: "20" });
    app.criarProduto();
    $("produtoSelect").value = "0";
  });

  const botao = (texto) => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === texto);

  test("24a. Botão Adicionar coloca o produto selecionado no carrinho", () => {
    botao("Adicionar").click();

    expect(app.carrinho).toHaveLength(1);
    expect($("listaCarrinho").textContent).toContain("Ração");
    expect($("total").textContent).toBe("30.00");
  });

  test("24b. Botão Remover tira um produto do carrinho e atualiza o total", () => {
    botao("Adicionar").click();
    $("produtoSelect").value = "1";
    botao("Adicionar").click();
    expect($("total").textContent).toBe("50.00");

    botao("Remover").click();

    expect(app.carrinho).toHaveLength(1);
    expect($("listaCarrinho").children).toHaveLength(1);
    expect($("total").textContent).not.toBe("50.00");
  });

  test("24c. Botão Finalizar exibe alerta e esvazia o carrinho", () => {
    botao("Adicionar").click();
    botao("Finalizar").click();

    expect(window.alert).toHaveBeenCalledWith("Compra finalizada: 30.00");
    expect(app.carrinho).toHaveLength(0);
    expect($("listaCarrinho").children).toHaveLength(0);
  });
});
