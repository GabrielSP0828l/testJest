const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

// O jsdom não implementa `innerText` (o app.js usa). Polyfill: espelha o textContent.
if (!Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerText")) {
  Object.defineProperty(window.HTMLElement.prototype, "innerText", {
    get() { return this.textContent; },
    set(v) { this.textContent = v; },
    configurable: true,
  });
}

/**
 * Carrega o index.html real no jsdom (sem a tag <script>) e executa o app.js
 * do zero (estado limpo a cada chamada). Retorna as funções/estado exportados.
 */
function carregarApp() {
  jest.resetModules();
  jest.useFakeTimers();

  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1].replace(/<script[\s\S]*?<\/script>/gi, "");
  document.body.innerHTML = body;

  window.alert = jest.fn();
  const app = require(path.join(ROOT, "app.js"));

  // Permite que os onclick="..." do HTML enxerguem as funções, como no navegador.
  Object.assign(window, {
    criarCliente: app.criarCliente, cadastrarPet: app.cadastrarPet, criarProduto: app.criarProduto,
    adicionarCarrinho: app.adicionarCarrinho, removerCarrinho: app.removerCarrinho,
    finalizarCompra: app.finalizarCompra, nextSlide: app.nextSlide, prevSlide: app.prevSlide,
  });
  return app;
}

const $ = (id) => document.getElementById(id);

function preencherCliente({ nome = "", email = "", vip = false } = {}) {
  $("clienteNome").value = nome;
  $("clienteEmail").value = email;
  $("clienteVip").checked = vip;
}
function preencherPet({ nome = "", tipo = "", idade = "" } = {}) {
  $("petNome").value = nome;
  $("petTipo").value = tipo;
  $("petIdade").value = idade;
}
function preencherProduto({ nome = "", preco = "" } = {}) {
  $("produtoNome").value = nome;
  $("produtoPreco").value = String(preco);
}

/** Cadastra um produto e o adiciona ao carrinho (fluxo real pela UI). */
function cadastrarEAdicionar(app, nome, preco) {
  preencherProduto({ nome, preco });
  app.criarProduto();
  $("produtoSelect").value = String(app.produtos.length - 1);
  app.adicionarCarrinho();
}

module.exports = { carregarApp, $, preencherCliente, preencherPet, preencherProduto, cadastrarEAdicionar };
