# 🐶 Doguito PetShop — Testes unitários e de integração (Jest)

Sistema web simples (HTML + JS puro) de gerenciamento de PetShop: clientes, pets, produtos, carrinho e carrossel.
Os testes cobrem os 24 requisitos do documento da atividade, em JavaScript com **Jest** (+ jsdom).

## Como executar

```bash
npm install
npm test                 # todos os testes
npm run test:unit        # somente unitários
npm run test:integration # somente integração
npm run test:coverage    # com cobertura
```

## Estrutura

```
app.js / index.html / style.css     sistema
tests/helpers/setup.js              carrega o index.html real no jsdom + app.js limpo a cada teste
tests/unit/cliente.test.js          testes 1–5
tests/unit/pet.test.js              testes 6–9
tests/unit/produto.test.js          testes 10–13
tests/unit/carrinho.test.js         testes 14–17 e 20
tests/unit/regras.test.js           testes 18–19, 21–22
tests/integration/fluxo.test.js     fluxo completo pelos botões (24) e compra ponta a ponta
tests/integration/carrossel.test.js troca automática de imagens (23) e botões ❮ ❯
```

- **Unitários**: preenchem os campos e chamam a função (`criarCliente`, `calcularTotal`...), verificando estado e DOM.
- **Integração**: clicam nos botões reais do `index.html` (`onclick`) e conferem listas, total, alertas e carrossel (com `jest.useFakeTimers()`).

Os números nos nomes dos testes (`1.`, `2.`...) correspondem à numeração do documento; sufixos (`2b`, `4b`...) são casos extras de borda.

## Histórico (vermelho → verde)

| Commit | Situação |
|---|---|
| 1 — `test: sistema original + testes` | Sistema **original** (só com o `module.exports` para o Jest): **20 testes falham**, expondo os bugs abaixo |
| 2 — `fix: corrige bugs` | Bugs corrigidos: **60/60 testes passam** |

### Bugs encontrados no sistema original

| # | Bug | Testes |
|---|---|---|
| 1 | Nome só com espaços era aceito | 2b |
| 2 | Validação de e-mail só checava `@` (aceitava `@`, `a@`, `a@b`...) | 4b |
| 3 | Pet sem tipo era aceito | 8 |
| 4 | Idade do pet não era validada (vazia, texto, negativa → `NaN`) | 9, 9b, 9c |
| 5 | Produto sem nome, com preço `0`, vazio ou `NaN` era aceito | 10b, 11, 11b |
| 6 | Carrinho aceitava produto com preço zero | 20, 20b |
| 7 | "Adicionar" sem produtos cadastrados gerava `TypeError` | 14b |
| 8 | Desconto de 15% para VIP não existia (e o carrinho não sabia quem era o cliente) | 19, 19b, 19c |

### Decisões / premissas

- Foi adicionado o seletor **"Sem cliente / cliente"** no card do Carrinho para permitir aplicar a regra VIP.
- Descontos **não acumulam**: vale o maior (compra > R$100 → 10%; VIP → 15%). Compra de exatamente R$100 não tem desconto ("acima de R$100").
- No `app.js` original a única alteração no commit 1 é o bloco `module.exports` no final (ignorado no navegador).
