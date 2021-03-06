
const productAPI = "https://www.product_countjsonapi.com/products/";


const cartOverlay = document.querySelector('.cart-overlay');
const myCartCountElement =　document.querySelector('.js-myCart-count');
const header = document.querySelector('.header');
const cartLists = document.querySelector('.cart-items');
const cartPriceElement = document.querySelector('.js-cartPrice');
const cartOpenUpElement = document.querySelector('.section');
const cartIcon = document.querySelector('.cartIcon');
const cart = document.querySelector('.cartWrapper');
const closeBtn = document.querySelector('.closeBtn');
const cartCount = document.querySelector('.cart-count');


const ToggleClasses = {
  CartElement: cart,
  OpenCartClass: "is-open",
  HeaderElement: header,
  CloseHeaderClass: "is-up",
}


class ShoppingCart {
  constructor(product){
    this.cart = [];
    this.cartTotal = [];
    this.cartLength = [];
    this.product = product;
    this.productCount = 1;
  }
  init(){
    this.cart = [];
    this.cartTotal = [];
  }
  addItem(event){
    const thisItem = this.product.find(item => item.id === event.currentTarget.id);
    thisItem["product_count"] = this.productCount;

    if (this.cart.indexOf(thisItem) !== -1) return thisItem;
    this.cart.push(thisItem);
  }
  removeItem(elementIndex){
    this.cart = this.cart.filter(item => { return item.id !== elementIndex });
  }
  getTotalSum(){
    this.cart.map(item => {
      const withoutDollars = item.product_price.split("$").join('');
      this.cartTotal.push( Number(withoutDollars) * item.product_count );
    });

    const math = this.cartTotal.reduce((sum, i) => { return sum + i; }, 0);

    this.cartTotal = [];
    
    const cartLength = this.cart.map(item => {
      return [item.product_count].reduce((sum, i) => {
        return [sum, i];
      });
    });
    
    if ( this.cart.length === 0 ) { 
      cartPriceElement.innerHTML = "";
      myCartCountElement.textContent = 0;
      cartCount.textContent = "(" + 0 + ")";
      return false;
    };
    const myCartCount = cartLength.reduce((sum, i) => { return sum + i } );

    cartPriceElement.innerHTML = wrapperCartTotal(math);
    myCartCountElement.textContent = myCartCount;
    cartCount.textContent = "(" + myCartCount + ")";
    return;
  }
}


const wrapperCartTotal = (totalPrice) => {
  return [
    '<div class="price">',
      '<span class="price-title">total: $</span>',
      '<span class="price-total">',
        totalPrice,
      '</span>',
    '</div>'
  ].join('');
}


const shoppingCart = new ShoppingCart(productsItems);
shoppingCart.init();


// template
document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('#imageTemplate').content;
  const fragment = document.createDocumentFragment();

  for (const data of productsItems ) {
    const clone = document.importNode(content, true);

    const li = clone.querySelector('li');
    const button = clone.querySelector('button');
    const title = clone.querySelector('.item-title');
    const image = clone.querySelector('.item-thumbnail img');
    const description = clone.querySelector('.item-description');
    const price = clone.querySelector('.item-price');

    li.id = data.id;
    button.id = data.id;
    image.src = data.product_image;
    image.alt = data.product_title;
    title.textContent = data.product_title;
    price.textContent = data.product_price;
    description.textContent = data.product_description;

    fragment.appendChild(clone);
  }

  document.querySelector('#productItems').appendChild(fragment);
  viewModel();
});


const viewModel = () => {
  const InitialState = {
    Cart: false
  }
  const addButtons = document.querySelectorAll('.js-addBtn');
  const counts = document.querySelectorAll('.js-select');

  addButtons.forEach(addButton => {
    addButton.addEventListener('click', (event) => {
      shoppingCart.addItem(event);
      shoppingCart.getTotalSum();
      openCart(!InitialState.Cart);
      shoppingCart.productCount = 1;
      toggleCart(
        ToggleClasses.CartElement, 
        ToggleClasses.OpenCartClass, 
        ToggleClasses.HeaderElement, 
        ToggleClasses.CloseHeaderClass
      );
    });
  });

  cartIcon.addEventListener('click', () => toggleCart(
    ToggleClasses.CartElement, 
    ToggleClasses.OpenCartClass, 
    ToggleClasses.HeaderElement, 
    ToggleClasses.CloseHeaderClass
    ));
  closeBtn.addEventListener('click', () => toggleCart(
    ToggleClasses.CartElement, 
    ToggleClasses.OpenCartClass, 
    ToggleClasses.HeaderElement, 
    ToggleClasses.CloseHeaderClass
  ));
  

  counts.forEach(count => {
    count.addEventListener('change', (event) => {
      shoppingCart.productCount = Number(event.currentTarget.value);
    })
  });
}

const openCart = (initialState) => {
  const cart = document.querySelector('#cartTemplate').content;
  const cartFragment = document.createDocumentFragment();

  for ( data of shoppingCart.cart ) {

    const clone = document.importNode(cart, initialState);
    const li = clone.querySelector('li');
    const button = clone.querySelector('.js-removeBtn');
    const title = clone.querySelector('.item-title');
    const image = clone.querySelector('.item-thumbnail img');
    const count = clone.querySelector('.item-count');
    const price = clone.querySelector('.item-price');


    li.id = data.id;
    button.id = data.id;
    image.src = data.product_image;
    image.alt = data.product_title;
    title.textContent = data.product_title;
    count.textContent = data.product_count;
    price.textContent = data.product_price;

    cartFragment.appendChild(clone);
  }
  
  const cartItemsWrap = document.querySelector('#cartItems');
  cartItemsWrap.innerHTML = [];
  cartItemsWrap.appendChild(cartFragment);

  const cartItemElement = document.querySelectorAll('.cart-item');
  cartOverlayScroll(cartItemElement)
}

const toggleCart = (cartElement, openClass, header, upClass) => {
  cartElement.classList.toggle(openClass);
  header.classList.toggle(upClass);
}

const cartOverlayScroll = (cartItemNodeElements) => {
  if ( cartItemNodeElements.length >= 4 ) {
    cartLists.classList.add('is-scroll');
    return;
  }
}

document.addEventListener('click', (event) => {
  if ( event.target && event.target.dataset.item === "remove" ) {
    event.target.closest('.cart-item').remove();
    shoppingCart.removeItem(event.target.id);
    shoppingCart.getTotalSum();
    toggleCart(cart, "is-open", header , "is-up")
  }  
});






