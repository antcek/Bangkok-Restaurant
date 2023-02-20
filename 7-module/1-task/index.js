import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.render(categories);
    this.slideRibbon();
    this.selectRibbonCategory()
  }

  render(categories) {

    this.elem = createElement(`
    <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left ">
        <img src="./assets/images/icons/angle-icon.svg" alt="icon">
      </button>
     <nav class="ribbon__inner">
      ${this.menuCategory(categories)}
     </nav>
     <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible ">
      <img src="./assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    </div>`);



  }

  selectRibbonCategory() {

    let categoryRibbon = this.elem.getElementsByClassName('ribbon__item');
    categoryRibbon[0].classList.add('ribbon__item_active');

    for (let selected of categoryRibbon) {

      selected.addEventListener('click', function select(event) {
        event.preventDefault();
        let target = event.target;

        for (let i = 0; i < categoryRibbon.length; i++) {
          categoryRibbon[i].classList.remove('ribbon__item_active');
        }

        target.classList.add('ribbon__item_active');

        let selectRibbCategory = new CustomEvent('ribbon-select', {
          detail: target.closest('.ribbon__item').dataset.id,
          bubbles: true
        });

        target.dispatchEvent(selectRibbCategory);

      });
    }
  }

  slideRibbon() {

    let ribbonInner = this.elem.querySelector('.ribbon__inner');
    let ribbonArrowLeft = this.elem.querySelector('.ribbon__arrow_left');
    let ribbonArrowRight = this.elem.querySelector('.ribbon__arrow_right');

    this.elem.addEventListener('click', function (event) {
      let target = event.target;

      if (!target.closest('.ribbon__arrow_left')
        && !target.closest('.ribbon__arrow_right'))
        return;

      else if (target === ribbonArrowRight || target.closest('.ribbon__arrow_right > img')) {
        ribbonInner.scrollBy(350, 0);
      }

      else if (target === ribbonArrowLeft || target.closest('.ribbon__arrow_left > img')) {
        ribbonInner.scrollBy(-350, 0);
      }

      ribbonInner.addEventListener('scroll', function () {
        let scrollLeft = ribbonInner.scrollLeft; // прокрутка слева
        let scrollWidth = ribbonInner.scrollWidth; // общая ширина скролла
        let clientWidth = ribbonInner.clientWidth;
        let scrollRight = scrollWidth - scrollLeft - clientWidth;

        if (scrollLeft === 0) {
          ribbonArrowLeft.classList.remove("ribbon__arrow_visible");
        }
        else ribbonArrowLeft.classList.add("ribbon__arrow_visible");

        if (scrollRight === 0) {
          ribbonArrowRight.classList.remove("ribbon__arrow_visible");
        }
        else ribbonArrowRight.classList.add("ribbon__arrow_visible");

      });

    });

  }

  menuCategory(categories) {

    return categories.map(function (item) {

      return `
     <a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>`
    }).join('');

  }


}
