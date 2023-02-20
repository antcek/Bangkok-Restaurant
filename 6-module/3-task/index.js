import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.render(slides);
    this.initCarousel(slides);
    this.getSlides(slides);

  }

  render(slides) {

    this.elem = createElement(`<div class="carousel">
    <!--Кнопки переключения-->
    <div class="carousel__arrow carousel__arrow_right">
      <img src="./assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    <div class="carousel__arrow carousel__arrow_left">
      <img src="./assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>
    <div class="carousel__inner">
      ${this.getSlides(slides)}
    </div>
  </div>`);

    this.elem.querySelector('.carousel__arrow_left').style.display = 'none';

    let addButton = this.elem.querySelectorAll('.carousel__button');

    for (let plusButton of addButton) {

      plusButton.addEventListener("click", function addProd(event) {
        let target = event.target;
        let addProd = new CustomEvent("product-add", {
          bubbles: true,
          detail: target.closest('.carousel__slide').dataset.id
        });

        target.dispatchEvent(addProd);

      });

    }
  }

  getSlides(slides) {
    return slides.map((item) => {
      return `<div class="carousel__slide" data-id=${item.id}>
    <img src="./assets/images/carousel/${item.image}" class="carousel__img" alt="slide">
    <div class="carousel__caption">
      <span class="carousel__price">€${item.price.toFixed(2)}</span>
      <div class="carousel__title">${item.name}</div>
      <button type="button" class="carousel__button">
        <img src="./assets/images/icons/plus-icon.svg" alt="icon">
      </button>
    </div>
  </div>`}).join('');
  }

  initCarousel(slides) {

    let counter = 0;
    let activeIndex = 1; // счётчик слайдов
    let slideCount = slides.length; // находит нужное количество слайдов

    function slide(event) {

      let slides = document.getElementsByClassName('carousel__inner');
      let arrowRight = document.querySelector('.carousel__arrow_right');
      let arrowLeft = document.querySelector('.carousel__arrow_left');
      let arrows = document.querySelectorAll('.carousel__arrow > img');
      let width = slides[0].offsetWidth;
      let target = event.target;

      if (target != arrows[0] && target != arrows[1] && target != arrowRight
        && target != arrowLeft) {
        return;

      }

      else if (target == arrows[0] || target == arrowRight) {

        counter += width;
        slides[0].style.transform = `translateX(${'-' + counter + 'px'})`;
        activeIndex++;

      }

      else if (target == arrows[1] || target == arrowLeft) {

        counter = counter - width;
        slides[0].style.transform = `translateX(${'-' + counter + 'px'})`;
        activeIndex--;

      };

      if (activeIndex >= slideCount) {
        arrowRight.style.display = 'none';

      }

      else arrowRight.style.display = '';

      if (counter === 0) {
        arrowLeft.style.display = 'none';
      }

      else arrowLeft.style.display = '';

    }
    this.elem.addEventListener('click', slide);

    document.addEventListener('DOMContentLoaded', function () {

    });

  }

}
