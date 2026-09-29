const { carregarApp } = require("../helpers/setup");

describe("Carrossel", () => {
  let app, slides;
  beforeEach(() => {
    app = carregarApp();
    slides = document.querySelector(".slides");
  });

  test("Possui 3 imagens/slides no HTML", () => {
    expect(document.querySelectorAll(".slide")).toHaveLength(3);
  });

  test("23. Deve trocar automaticamente as imagens a cada 4 segundos", () => {
    expect(app.slideIndex).toBe(0);

    jest.advanceTimersByTime(3999);
    expect(app.slideIndex).toBe(0); // ainda não passou o intervalo

    jest.advanceTimersByTime(1);
    expect(app.slideIndex).toBe(1);
    expect(slides.style.transform).toBe("translateX(-100%)");

    jest.advanceTimersByTime(4000);
    expect(app.slideIndex).toBe(2);
    expect(slides.style.transform).toBe("translateX(-200%)");
  });

  test("23b. Ao chegar no último slide, volta ao primeiro (loop)", () => {
    jest.advanceTimersByTime(4000 * 3);

    expect(app.slideIndex).toBe(0);
    expect(slides.style.transform).toBe("translateX(-0%)");
  });

  test("Botão próximo (❯) avança o slide", () => {
    document.querySelector(".next").click();

    expect(app.slideIndex).toBe(1);
  });

  test("Botão anterior (❮) volta ao último slide a partir do primeiro", () => {
    document.querySelector(".prev").click();

    expect(app.slideIndex).toBe(2);
    expect(slides.style.transform).toBe("translateX(-200%)");
  });
});
