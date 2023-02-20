import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon, product, count) {
    this.cartIcon = cartIcon;
    this.product = product;
    this.count = count;
    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) {
      return;
    }

    let newProduct = {
      product,
      count: 1,
    };

    if (this.cartItems.length === 0) {

      this.cartItems.push(newProduct);

    }

    else if (this.cartItems.find(item => item.product.name === product.name)) {

      this.cartItems.find(item => item.product.name === product.name).count++

    }

    else {

      this.cartItems.push(newProduct);

    }

    this.onProductUpdate(newProduct);
  }

  updateProductCount(productId, amount) {
    let currentProd = this.cartItems.find(item => item.product.id === productId);

    if (amount > 0) {
      currentProd.count = currentProd.count + amount;
    }

    else if (amount < 0) {

      currentProd.count = currentProd.count + amount;
    }

    if (currentProd.count === 0) {
      this.cartItems = this.cartItems.filter((item) => item !== currentProd)

    }

    this.onProductUpdate(currentProd)
  }

  isEmpty() {
    if (this.cartItems.length === 0) {
      return true;
    }
    else return false;
  }

  getTotalCount() {
    let totalCount = this.cartItems.reduce((accumulator, item) => {

      return accumulator + item.count
    }, 0);

    return totalCount;
  }

  getTotalPrice() {
    let totalprice = this.cartItems.reduce((accumulator, item) => {

      return accumulator + item.product.price * item.count
    }, 0)
    return totalprice;
  }

  renderProduct(product, count) {

    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="./assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="./assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="./assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {

    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
      2
    )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {

    let modalCart = new Modal();

    this.modal = modalCart;
    this.modal.setTitle("Your order");

    let modalBody = createElement('<div>');

    this.cartItems.map(item => {
      modalBody.append(this.renderProduct(item.product, item.count))
    });

    let orderForm = this.renderOrderForm();
    this.orderForm = orderForm;
    modalBody.append(this.renderOrderForm());
    modalCart.setBody(modalBody);
    this.modalBody = document.querySelector('.modal__body');

    modalBody.addEventListener('click', (event) => {

      let target = event.target;
      let btnModal = target.closest('.cart-counter__button');

      if (!btnModal) {
        return;
      }

      let productCartId = btnModal.closest('.cart-product').dataset.productId;

      if (target.closest('.cart-counter__button_minus')) {
        this.updateProductCount(productCartId, -1)

      }

      else {
        this.updateProductCount(productCartId, 1)
      }

    });

    this.modalBody.querySelector('.cart-form').addEventListener('submit', (event) => {

      this.onSubmit(event)

    });
    this.modal.open();
  }

  onProductUpdate(cartItem) {

    let modalOpen = document.querySelector('body').classList.contains('is-modal-open');

    this.cartIcon.update(this);
    if (!modalOpen) {
      return;
    }

    let productId = cartItem.product.id;


    let productCount = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
    let productPrice = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
    let infoPrice = this.modalBody.querySelector(`.cart-buttons__info-price`);

    productCount.innerHTML = cartItem.count

    productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`

    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`


    if (this.cartItems.length === 0) {
      this.modal.close()
    }


  }

  onSubmit(event) {
    event.preventDefault();
    let cartIcon = document.querySelector('.cart-icon')
    let btnSubmit = document.querySelector('[type="submit"]')
    btnSubmit.classList.add('is-loading');
    let formOrder = new FormData(this.orderForm)
    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: formOrder
    }).then(response => {
      if (response.ok) {
        this.cartItems.splice(0, this.cartItems.length),

          this.modal.setTitle('Success!'),
          this.modal.setBody(createElement(`<div class="modal__body-inner">
    <p>
      Order successful! Your order is being cooked :) <br>
      We’ll notify you about delivery time shortly.<br>
      <img src="./assets/images/delivery.gif">
    </p>
  </div>`)),

          cartIcon.classList.remove('cart-icon_visible')
      }
      return response.json();
    })

  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

