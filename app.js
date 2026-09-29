let clientes=[]
let pets=[]
let produtos=[]
let carrinho=[]

// CLIENTE

function criarCliente(){

let nome=clienteNome.value
let email=clienteEmail.value
let vip=clienteVip.checked

nome=nome.trim()
email=email.trim()

if(nome==""){
alert("Nome inválido")
return
}

if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
alert("Email inválido")
return
}

clientes.push({nome,email,vip})

renderClientes()

}

function renderClientes(){

listaClientes.innerHTML=""

let selecionado=clienteSelect.value
clienteSelect.innerHTML=""
let visitante=document.createElement("option")
visitante.value=""
visitante.innerText="Sem cliente"
clienteSelect.appendChild(visitante)

clientes.forEach((c,i)=>{
let li=document.createElement("li")
li.innerText=c.nome+" - "+c.email+(c.vip?" (VIP)":"")
listaClientes.appendChild(li)

let op=document.createElement("option")
op.value=i
op.innerText=c.nome+(c.vip?" (VIP)":"")
clienteSelect.appendChild(op)
})

clienteSelect.value=selecionado

}

// PET

function cadastrarPet(){

let nome=petNome.value.trim()
let tipo=petTipo.value.trim()
let idadeTexto=petIdade.value.trim()
let idade=Number(idadeTexto)

if(nome==""){
alert("Pet precisa de nome")
return
}

if(tipo==""){
alert("Pet precisa de tipo")
return
}

if(idadeTexto=="" || !Number.isInteger(idade) || idade<0){
alert("Idade inválida")
return
}

pets.push({nome,tipo,idade})

renderPets()

}

function renderPets(){

listaPets.innerHTML=""

pets.forEach(p=>{
let li=document.createElement("li")
li.innerText=p.nome+" ("+p.tipo+")"
listaPets.appendChild(li)
})

}

// PRODUTOS

function criarProduto(){

let nome=produtoNome.value.trim()
let preco=parseFloat(produtoPreco.value)

if(nome==""){
alert("Nome do produto inválido")
return
}

if(isNaN(preco) || preco<=0){
alert("Preço inválido")
return
}

produtos.push({nome,preco})

renderProdutos()

}

function renderProdutos(){

listaProdutos.innerHTML=""
produtoSelect.innerHTML=""

produtos.forEach((p,i)=>{

let li=document.createElement("li")
li.innerText=p.nome+" - R$ "+p.preco
listaProdutos.appendChild(li)

let op=document.createElement("option")
op.value=i
op.innerText=p.nome
produtoSelect.appendChild(op)

})

}

// CARRINHO

function adicionarCarrinho(){

let p=produtos[produtoSelect.value]

if(!p){
alert("Selecione um produto")
return
}

if(!(p.preco>0)){
alert("Produto com preço inválido")
return
}

carrinho.push(p)

renderCarrinho()

}

function removerCarrinho(){

carrinho.shift()

renderCarrinho()

}

function renderCarrinho(){

listaCarrinho.innerHTML=""

carrinho.forEach(p=>{

let li=document.createElement("li")
li.innerText=p.nome+" - "+p.preco
listaCarrinho.appendChild(li)

})

calcularTotal()

}

// TOTAL

function calcularTotal(){

let total=0

carrinho.forEach(p=>{

total+=p.preco

})

let cliente=clientes[clienteSelect.value]
let desconto=0

if(total>100) desconto=0.10
if(cliente && cliente.vip) desconto=Math.max(desconto,0.15)

total*=(1-desconto)

total=total.toFixed(2)

document.getElementById("total").innerText=total

return total

}

// FINALIZAR

function finalizarCompra(){

alert("Compra finalizada: "+calcularTotal())

carrinho=[]

renderCarrinho()

}


renderClientes()

// CARROSSEL

let slideIndex = 0

function nextSlide(){
slideIndex++
updateSlide()
}

function prevSlide(){
slideIndex--
updateSlide()
}

function updateSlide(){

const slides = document.querySelector(".slides")
const total = document.querySelectorAll(".slide").length

if(slideIndex >= total) slideIndex = 0
if(slideIndex < 0) slideIndex = total - 1

slides.style.transform = "translateX(-" + slideIndex * 100 + "%)"

}

setInterval(nextSlide,4000)


// Exportação para testes (Jest/Node). No navegador `module` não existe e este bloco é ignorado.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    criarCliente, renderClientes,
    cadastrarPet, renderPets,
    criarProduto, renderProdutos,
    adicionarCarrinho, removerCarrinho, renderCarrinho,
    calcularTotal, finalizarCompra,
    nextSlide, prevSlide, updateSlide,
    get clientes() { return clientes },
    get pets() { return pets },
    get produtos() { return produtos },
    get carrinho() { return carrinho },
    get slideIndex() { return slideIndex },
  }
}
