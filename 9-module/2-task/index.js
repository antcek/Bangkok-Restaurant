import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';
//import Carousel from '../../6-module/3-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {

    this.carousel = new Carousel(slides);
    let dataCarousHolder = document.querySelector('[data-carousel-holder]');
    dataCarousHolder.append(this.carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    let dataRibbonHolder = document.querySelector('[data-ribbon-holder]');
    dataRibbonHolder.append(this.ribbonMenu.elem);

    this.stepSlider = new StepSlider({ steps: 5, value: 3, })
    let dataStepSlider = document.querySelector('[data-slider-holder]');
    dataStepSlider.append(this.stepSlider.elem);

    this.cartIcon = new CartIcon();
    let dataIconHolder = document.querySelector('[data-cart-icon-holder]');
    dataIconHolder.append(this.cartIcon.elem);

    this.cart = new Cart(this.cartIcon);

    let response = await fetch('products.json')
    this.products = await response.json();

    this.productsGrid = new ProductsGrid(this.products);
    let dataProductsHolder = document.querySelector('[data-products-grid-holder]');

    dataProductsHolder.innerHTML = '';
    dataProductsHolder.append(this.productsGrid.elem);

    this.filterProduct();

    document.body.addEventListener('product-add', (event) => {

      for (let product of this.products) {

        if (event.detail == product.id) {
          this.cart.addProduct(product)
        }
      }

    });

    document.body.addEventListener('slider-change', ({ detail: value }) => {

      this.productsGrid.updateFilter({
        maxSpiciness: value
      })

    });

    document.body.addEventListener('ribbon-select', ({ detail: categoryId }) => {

      this.productsGrid.updateFilter({
        category: categoryId
      })
    });

    this.filterCheckBox()
    this.filterProduct()
  }

  filterProduct() {

    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value

    });
  }

  filterCheckBox() {
    document.body.addEventListener('change', (event) => {
      let target = event.target
      if (event.target.id === 'vegeterian-checkbox') {

        this.productsGrid.updateFilter({
          vegeterianOnly: target.checked // новое значение чекбокса
        });
      };

      if (event.target.id === 'nuts-checkbox') {

        this.productsGrid.updateFilter({
          noNuts: target.checked
        });
      };

    });
  }
}
