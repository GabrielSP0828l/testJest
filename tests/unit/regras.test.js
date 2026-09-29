const { carregarApp, $, preencherCliente, cadastrarEAdicionar } = require("../helpers/setup");

/** Seleciona o cliente que está comprando (campo #clienteSelect do carrinho). */
function selecionarCliente(app, indice) {
  const sel = $("clienteSelect");
  if (!sel) throw new Error("Não existe #clienteSelect: o carrinho não sabe qual cliente está comprando");
  sel.value = String(indice);
}

describe("Testes de Regras de Negócio", () => {
  let app;
  beforeEach(() => { app = carregarApp(); });

  test("18. Compra acima de R$100 deve aplicar desconto de 10%", () => {
    cadastrarEAdicionar(app, "Cama", 200);

    expect(Number(app.calcularTotal())).toBeCloseTo(180, 2);
  });

  test("18b. Compra de exatamente R$100 NÃO recebe desconto (regra é 'acima de')", () => {
    cadastrarEAdicionar(app, "Cama", 100);

    expect(Number(app.calcularTotal())).toBeCloseTo(100, 2);
  });

  test("18c. Compra de R$100,01 já recebe desconto", () => {
    cadastrarEAdicionar(app, "Cama", 100.01);

    expect(Number(app.calcularTotal())).toBeCloseTo(90.01, 2);
  });

  test("18d. Compra abaixo de R$100 não recebe desconto", () => {
    cadastrarEAdicionar(app, "Bola", 99.99);

    expect(Number(app.calcularTotal())).toBeCloseTo(99.99, 2);
  });

  test("18e. Desconto vale para a soma de vários produtos", () => {
    cadastrarEAdicionar(app, "Ração", 60);
    cadastrarEAdicionar(app, "Coleira", 60);

    expect(Number(app.calcularTotal())).toBeCloseTo(108, 2);
  });

  test("19. Cliente VIP deve receber desconto de 15%", () => {
    preencherCliente({ nome: "Ana", email: "ana@email.com", vip: true });
    app.criarCliente();
    cadastrarEAdicionar(app, "Bola", 50); // abaixo de R$100: só o desconto VIP se aplica
    selecionarCliente(app, 0);

    expect(Number(app.calcularTotal())).toBeCloseTo(42.5, 2);
  });

  test("19b. Cliente comum (não VIP) não recebe o desconto de 15%", () => {
    preencherCliente({ nome: "Beto", email: "beto@email.com", vip: false });
    app.criarCliente();
    cadastrarEAdicionar(app, "Bola", 50);
    selecionarCliente(app, 0);

    expect(Number(app.calcularTotal())).toBeCloseTo(50, 2);
  });

  test("19c. VIP e compra > R$100: aplica-se o maior desconto (15%), sem acumular", () => {
    preencherCliente({ nome: "Ana", email: "ana@email.com", vip: true });
    app.criarCliente();
    cadastrarEAdicionar(app, "Cama", 200);
    selecionarCliente(app, 0);

    expect(Number(app.calcularTotal())).toBeCloseTo(170, 2);
  });

  test("21. Carrinho vazio deve retornar total igual a 0", () => {
    expect(Number(app.calcularTotal())).toBe(0);
    expect($("total").textContent).toBe("0.00");
  });

  test("22. Ao finalizar compra o carrinho deve ser limpo", () => {
    cadastrarEAdicionar(app, "Ração", 40);
    cadastrarEAdicionar(app, "Bola", 10);
    app.finalizarCompra();

    expect(app.carrinho).toHaveLength(0);
    expect($("listaCarrinho").children).toHaveLength(0);
    expect(Number($("total").textContent)).toBe(0);
  });

  test("22b. Ao finalizar, o alerta mostra o total da compra", () => {
    cadastrarEAdicionar(app, "Ração", 40);
    app.finalizarCompra();

    expect(window.alert).toHaveBeenCalledWith("Compra finalizada: 40.00");
  });
});
