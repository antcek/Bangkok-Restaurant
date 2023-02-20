export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.renderStepSlide();
    this.sliderChangeValue();
    this.dragAndDrop()
  }

  renderStepSlide() {

    this.elem = document.createElement('div');
    this.elem.classList.add('slider');
    this.elem.innerHTML = `
    <!--Ползунок слайдера с активным значением-->
    <div class="slider__thumb">
      <span class="slider__value">${this.value}</span>
    </div>
  
    <div class="slider__progress"></div>
    <div class="slider__steps">
      
    </div>`

    let sliderSteps = this.elem.querySelector('.slider__steps');
    
    for (let i = 0; i < this.steps; i++) {

      let s = document.createElement('span');

      if (i === this.value) {
        s.classList.add('slider__step-active');
      }
      sliderSteps.append(s);

    }

  }

  sliderChangeValue() {

    let slider = this.elem;
    let allSteps = this.elem.querySelectorAll('.slider__steps > span');
    let segmentSlider = allSteps.length - 1;
    let sliderValue = this.elem.querySelector('.slider__value');
    let thumb = this.elem.querySelector('.slider__thumb');
    const startValue = `75%`;
    
    this.elem.querySelector('.slider__progress').style.width = startValue; // заполненная шкала
    thumb.style.left = startValue;

    slider.addEventListener('click', (event) => {

      let rect = slider.getBoundingClientRect(); // значения слайдера
      let leftPercents = event.clientX - rect.left; // координаты курсора - расстояние от окноа до слайдера слева
      let leftRelative = leftPercents / slider.offsetWidth; // относительное значение от слайдера
      let approximateValue = leftRelative * segmentSlider; // относ. значение на кол-во сегментов
      let value = Math.round(approximateValue); // округление значения
      let valuePercents = value / segmentSlider * 100; // значение для преобразование в проценты

      let progress = this.elem.querySelector('.slider__progress');

      for (let step of allSteps) {
        step.classList.remove('slider__step-active')
      }

      this.value = valuePercents / 100 * segmentSlider;

      let customChange = new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true
      });

      slider.dispatchEvent(customChange);

      allSteps[this.value].classList.add('slider__step-active');
      sliderValue.innerHTML = `${this.value}`;
      thumb.style.left = `${valuePercents}%`;
      progress.style.width = `${valuePercents}%`;

    });

  }

  dragAndDrop() {

    let thumbDrag = this.elem.querySelector('.slider__thumb');
    let progressDrag = this.elem.querySelector('.slider__progress');
    let sliderValue = this.elem.querySelector('.slider__value');
    let allSteps = this.elem.querySelectorAll('.slider__steps > span');
    let segmentSlider = allSteps.length - 1;
    thumbDrag.addEventListener('pointerdown', (event) => {
      event.preventDefault();

      thumbDrag.style.position = 'absolute';
      thumbDrag.style.zIndex = 1000;
      let onMouseMove = (event) => {

        this.elem.classList.add('slider_dragging');
        event.preventDefault();

        let rect = this.elem.getBoundingClientRect();
        let left = event.clientX - rect.left;
        let leftRelative = left / this.elem.offsetWidth;

        if (leftRelative < 0) {
          leftRelative = 0;
        }

        if (leftRelative > 1) {
          leftRelative = 1;
        }

        let leftPercents = leftRelative * 100;

        thumbDrag.style.left = `${leftPercents}%`;
        progressDrag.style.width = `${leftPercents}%`;

        let approximateValue = leftRelative * segmentSlider;
        let value = Math.round(approximateValue);
        let valuePercents = value / segmentSlider * 100;

        this.value = valuePercents / 100 * segmentSlider;

        sliderValue.innerHTML = `${this.value}`;

        for (let step of allSteps) {
          step.classList.remove('slider__step-active')
        }
        allSteps[this.value].classList.add('slider__step-active');

      };

      document.addEventListener('pointermove', onMouseMove);

      document.onpointerup = () => {

        thumbDrag.style.left = `${this.value / segmentSlider * 100}%`;
        progressDrag.style.width = `${this.value / segmentSlider * 100}%`;

        this.elem.classList.remove('slider_dragging')

        let dragCustom = new CustomEvent('slider-change', {
          detail: this.value,
          bubbles: true
        });
        this.elem.dispatchEvent(dragCustom);

        document.removeEventListener('pointermove', onMouseMove);

        document.onpointerup = null;
      };

    });

    thumbDrag.ondragstart = function () { return false };
  }
}
