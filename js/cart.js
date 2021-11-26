const productAPI = "https://www.testjsonapi.com/products/";
const products = document.querySelector('.items');

const getProducts = (url) => {
  return axios.get(url).then(res => {
    return res.data;
  }).catch( err => {
    console.log(err)
  })
}

getProducts(productAPI).then(products => {
  renderItems(products)
  shoppingCart(products);
})

const renderItems = (products) => {
   return products.map(item => {
    const items =
      `<li class="item">
        <div class="item-thumbnail">
          <img src=${item.product_image} alt=${item.product_title} />
        </div>
        <div class="item-content text">
          <p class="item-title">${item.product_title}</p>
          <p class="item-price">${item.product_price}</p>
          <button id=${item.id} class="btn js-addBtn">add cart</button>
        </div>
      </li>`;
    $('.items').append(items)
  })
}




const shoppingCart = (products) => {
  const cart = [];
  console.log(products);
  const $addBtn = $('.js-addBtn');

  $addBtn.on('click', () => {
    console.log()
  })
}

