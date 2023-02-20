import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {

    this.modalRender();

  }

  open() {
    document.body.classList.add('is-modal-open');

  }

  modalRender() {

    this.elem = createElement(`<div class="modal">
    <div class="modal__overlay"></div>
    <div class="modal__inner">
    <div class="modal__header">
      <!--Кнопка закрытия модального окна-->
      <button type="button" class="modal__close">
        <img src="/jsbasic-20221028_antonprotasow69/assets/images/icons/cross-icon.svg" alt="close-icon" />
      </button>
      <h3 class="modal__title ">
      Вот сюда нужно добавлять заголовок 
      </h3>
    </div>
    <div class="modal__body">
    A сюда нужно добавлять содержимое тела модального окна
    </div>
  </div>
  </div>`)

    document.body.appendChild(this.elem);
    this.closeOnMark();
    this.closeOnKey();
  }

  setTitle(titleName) {

    let modalTitle = this.elem.querySelector('.modal__title');
    modalTitle.innerHTML = titleName;
  }

  setBody(modalBody) {

    let oldBody = this.elem.querySelector('.modal__body');
    oldBody.innerHTML = null;

    oldBody.appendChild(modalBody)

  }

  close() {

    this.elem.remove();
    document.body.classList.remove('is-modal-open');

    document.removeEventListener('keydown', this.escPressed)

  }

  closeOnMark() {

    let closeButton = this.elem.querySelector('.modal__close');

    closeButton.addEventListener('click', () => {

      this.elem.remove()
      document.body.classList.remove('is-modal-open');
      document.removeEventListener('keydown', this.escPressed)

    });

  }

  closeOnKey() {
    document.addEventListener('keydown', this.escPressed)
  }

  escPressed = (event) => {

    if (event.code === 'Escape') {
      this.close();
    };
  };
}
