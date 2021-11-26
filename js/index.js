
const productAPI = "https://www.product_countjsonapi.com/products/";


class ShoppingCart {
  constructor(product){
    this.cart = [];
    this.mathTotal = [];
    this.product = product;
    this.productCount = 1;
  }
  init(){
    this.cart = [];
    this.mathTotal = [];
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
      this.mathTotal.push( Number(withoutDollars) * item.product_count );
    });

    const math = this.mathTotal.reduce((sum, i) => { return sum + i; }, 0);
    console.log(this.mathTotal, "合計");

    this.mathTotal = [];
    const cartPrice = document.querySelector('.js-cartPrice');
    if ( this.cart.length === 0 ) {
      return cartPrice.innerHTML = [];
    }
    return cartPrice.innerHTML = wrapperCartTotal(math);
  }
}

const wrapperCartTotal = (totalPrice) => {
  return [
    '<div>',
      '<span>total: </span>',
      '<span>',
        totalPrice,
      '</span>',
    '</div>'
  ].join('');
}


const shoppingCart = new ShoppingCart(productsItems);
shoppingCart.init();


// template
document.addEventListener('DOMContentLoaded', () => {
  // template要素からコンテンツを取得、
  const content = document.querySelector('#imageTemplate').content;
  // フラグメント
  const fragment = document.createDocumentFragment();

  for (const data of productsItems ) {
    // テンプレートのノードを複製
    const clone = document.importNode(content, true);

    //テンプレート内の要素
    const li = clone.querySelector('li');
    const button = clone.querySelector('button');
    const title = clone.querySelector('.item-title');
    const image = clone.querySelector('.item-thumbnail img');
    const description = clone.querySelector('.item-description');
    const removes = clone.querySelector('.js-removeBtn');

    // テンプレートの要素に適用する
    li.id = data.id;
    button.id = data.id;
    image.src = data.product_image;
    image.alt = data.product_title;
    title.textContent = data.product_title;
    description.textContent = data.product_description;

    // 複製したノードをフラグメントに挿入
    fragment.appendChild(clone);
  }

  // HTMLに挿入
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
    })
  });


  counts.forEach(count => {
    count.addEventListener('change', (event) => {
      let inputNumber = event.currentTarget.value;
      shoppingCart.productCount = Number(inputNumber);
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
  const clear = "";
  cartItemsWrap.innerHTML = clear;
  cartItemsWrap.appendChild(cartFragment);
}

document.addEventListener('click', (event) => {
  // remove
  if ( event.target && event.target.dataset.item === "remove" ) {
    event.target.closest('.cart-item').remove();
    shoppingCart.removeItem(event.target.id);
    shoppingCart.getTotalSum();
  }
})




