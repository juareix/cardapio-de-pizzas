let cart = [];
let modalQt = 1;
let modalKey = 0;

//funçao pra evitar inumeras vezes o querySelector()
const c = (el) => {
    return document.querySelector(el)
}
//funçao pra evitar inumeras vezes o querySelectorAll()
const cs = (el) => {
    return document.querySelectorAll(el)
}

//listagem das pizzas:

//pegando o array de pizzas do pizzas.js  e fazendo um map nele, que irá executar em todos 
//de um por um, cada passo especificado a seguir:
pizzaJson.map((item, index)=>{
    //clona o item:
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //preencher as informaçoes em pizza item no menu principal

    pizzaItem.setAttribute('data-key', index)//coloca o index de cada elemento do array no seu corresponde div de pizza criada

    pizzaItem.querySelector('.pizza-item--img img').src = item.img

    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`

    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name

    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        //previne que ao clicar na pizza a pagina ataulize:
        e.preventDefault();

        //vai pegar o indice da pizza clicada e exibir suas informações no modal
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`


        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt

        //mostra  o modal e faz um animaçao de transição:
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        c('.pizzaWindowArea').style.opacity = 0.5;
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200)
    })
    //aqui se usa o append pois ele vai indo colocando um junto ao outro
    //e não vai subtituindo um após outro
    //coloca o item na tela:
    c('.pizza-area').append(pizzaItem)

});

//Eventos do modal:

//função para fechar o modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    },500)
}

//adiciona o evento de clique aos dois botoes de cancelamento do modal:
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
})

//evento do botao de quantidade de pizza 'menos'
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
})

//evento do botao de quantidade de pizza 'mais'
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt
})

//evento de seleçao do tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    })
});

//evento do botao adicionar ao carrinho e tbm de salvar as preferencias de pizza escolhidos
c('.pizzaInfo--addButton').addEventListener('click' , ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    let identifier = pizzaJson[modalKey].id + '@' +size;

    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    })

    if(key > -1){
        cart[key].qt += modalQt
    }
    else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }
    updateCart();
    closeModal();
})

//inserindo evento no button mobile de abrir cart
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length>0){
        c('aside').style.left = '0'
    }
})

//inserindo evento no button mobile de fechar cart
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw'
})

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length>0){
        c('aside').classList.add('show')
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)

            subtotal += pizzaItem.price * cart[i].qt;

            //clonando os itens para adiconar ao cart:
            let cartItem = c(".models .cart--item").cloneNode(true);

            //adicionando as informacoes individuais de cada item no cart:
            cartItem.querySelector('img').src = pizzaItem.img

            //concatenando o nome mais tamanho para aparecer num lugar só:
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector(".cart--item-qtmenos").addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }
                else{
                    cart.splice(i, 1);
                }
                updateCart()
            })
            cartItem.querySelector(".cart--item-qtmais").addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart()
            })

            c('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1
        total= subtotal - desconto

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    }
    else{
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}