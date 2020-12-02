
//Koden for å sjekke om dokumentet har lastet inn (loaded) før man prøver
//å bruke deler av det, viktig å ha i alle js man jobber med
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

//Her legger vi til en knapp som gjør at man kan fjerne varer fra handlekurv. 
//Button-elementet kommuniserer med remove-elementet, ved hjelp av addEventListener
//og et click-event gjør at det blir mulig å fjerne varen.
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

//'Change' gjør at vi kan justere antallet eller the quantity.
//"Endre kvantitet i handlekurven"
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

//Legge til varer i handlekurven ved å 'click" på en button
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

//Betale-knapp
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

//Beskjed om at varene er kjøpt, en pop-up
function purchaseClicked() {
    alert('Takk for at du handlet hos oss!')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

//Fjerne vare fra handlekurv 
function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

//Endre antall av en vare i handlekurv
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

//Gjør at både tittel, pris og bilde følger med til en oversikt over varer i handlekurven
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

//Legger inn en sperre på varer som allerede er i handlekurv, 
//med alert (for å varsle at den allerede er lagt til) og
//for å ikke bruke html-koden som fortsetter videre i koden så
//legges det inn en return som stopper den fra å bruke den delen av koden
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('Denne varen er allerede i handlekurven!')
            return
        }
    }
    //Bruker html-koden direkte for å lage en cart-row (oversikt) i handlekurven
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">FJERN</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

//Oppdaterer handlekurven med samlet sum for de valgte varene i (kr)
//samt at illutrasjonen av varen legges i kurven med et valg om å endre antallet man ønsker å kjøpe
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('kr', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = 'kr' + total
}