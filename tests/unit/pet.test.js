const { carregarApp, $, preencherPet } = require("../helpers/setup");

describe("Testes de Pet", () => {
  let app;
  beforeEach(() => { app = carregarApp(); });

  test("6. Deve permitir cadastrar um pet", () => {
    preencherPet({ nome: "Rex", tipo: "cachorro", idade: "3" });
    app.cadastrarPet();

    expect(app.pets).toEqual([{ nome: "Rex", tipo: "cachorro", idade: 3 }]);
    expect($("listaPets").textContent).toContain("Rex (cachorro)");
  });

  test("7. Pet deve possuir nome obrigatório", () => {
    preencherPet({ nome: "", tipo: "gato", idade: "2" });
    app.cadastrarPet();

    expect(app.pets).toHaveLength(0);
    expect(window.alert).toHaveBeenCalledWith("Pet precisa de nome");
  });

  test("8. Pet deve possuir tipo (cachorro, gato, etc)", () => {
    preencherPet({ nome: "Mimi", tipo: "", idade: "2" });
    app.cadastrarPet();

    expect(app.pets).toHaveLength(0);
    expect(window.alert).toHaveBeenCalled();
  });

  test("8b. Deve aceitar diferentes tipos de pet", () => {
    ["cachorro", "gato", "pássaro"].forEach((tipo, i) => {
      preencherPet({ nome: "Pet" + i, tipo, idade: "1" });
      app.cadastrarPet();
    });

    expect(app.pets.map((p) => p.tipo)).toEqual(["cachorro", "gato", "pássaro"]);
  });

  test("9. Pet deve possuir idade válida (número)", () => {
    preencherPet({ nome: "Rex", tipo: "cachorro", idade: "abc" });
    app.cadastrarPet();

    expect(app.pets).toHaveLength(0);
    expect(window.alert).toHaveBeenCalled();
  });

  test("9b. Pet não pode ter idade vazia", () => {
    preencherPet({ nome: "Rex", tipo: "cachorro", idade: "" });
    app.cadastrarPet();

    expect(app.pets).toHaveLength(0);
  });

  test("9c. Pet não pode ter idade negativa", () => {
    preencherPet({ nome: "Rex", tipo: "cachorro", idade: "-2" });
    app.cadastrarPet();

    expect(app.pets).toHaveLength(0);
  });

  test("9d. Pet com idade numérica válida é armazenada como número", () => {
    preencherPet({ nome: "Rex", tipo: "cachorro", idade: "5" });
    app.cadastrarPet();

    expect(typeof app.pets[0].idade).toBe("number");
    expect(app.pets[0].idade).toBe(5);
  });
});
