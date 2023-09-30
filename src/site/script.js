"use strict";

document.addEventListener("DOMContentLoaded", function () {
  class ItcModal {
    #elem;
    #template =
      '<div class="itc-modal-backdrop"><div class="itc-modal-content"><div class="itc-modal-header">{{title}}</div><div class="itc-modal-body">{{content}}</div></div></div>';
    #templateFooter = '<div class="itc-modal-footer">{{buttons}}</div>';
    #templateBtn =
      '<button type="button" class="{{class}}" data-action={{action}}>{{text}}</button>';
    #eventShowModal = new Event("show.itc.modal", { bubbles: true });
    #eventHideModal = new Event("hide.itc.modal", { bubbles: true });
    #disposed = false;

    constructor(options = []) {
      this.#elem = document.createElement("div");
      this.#elem.classList.add("itc-modal");
      let html = this.#template.replace(
        "{{title}}",
        options.title || "Новое окно"
      );
      html = html.replace("{{content}}", options.content || "");
      const buttons = (options.footerButtons || []).map((item) => {
        let btn = this.#templateBtn.replace("{{class}}", item.class);
        btn = btn.replace("{{action}}", item.action);
        return btn.replace("{{text}}", item.text);
      });
      const footer = buttons.length
        ? this.#templateFooter.replace("{{buttons}}", buttons.join(""))
        : "";
      html = html.replace("{{footer}}", footer);
      this.#elem.innerHTML = html;
      document.body.append(this.#elem);
      this.#elem.addEventListener("click", this.#handlerCloseModal.bind(this));
    }

    #handlerCloseModal(e) {
      if (
        e.target.closest(".close") ||
        e.target.classList.contains("itc-modal-backdrop")
      ) {
        this.hide();
      }
    }

    show() {
      if (this.#disposed) {
        return;
      }
      this.#elem.classList.add("itc-modal-show");
      this.#elem.dispatchEvent(this.#eventShowModal);
    }

    hide() {
      this.#elem.classList.remove("itc-modal-show");
      this.#elem.dispatchEvent(this.#eventHideModal);
    }

    dispose() {
      this.#elem.remove(this.#elem);
      this.#elem.removeEventListener("click", this.#handlerCloseModal);
      this.#disposed = true;
    }

    setBody(html) {
      this.#elem.querySelector(".itc-modal-body").innerHTML = html;
    }

    setTitle(text) {
      this.#elem.querySelector(".itc-modal-title").innerHTML = text;
    }
  }

  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);

    let formData = new FormData(form);

    const modal = new ItcModal({
      title:
        '<a href="#" "title="Close"class="close"><img class="img-close" src="./img/Cross.png" alt="close"/></a>',
      content:
        '<div class="modal-form"><div class="modal-text"><p class="modal-heading">Ваша заявка отправлена</p><p class="modal-text-main">Специалист свяжется с вами в ближайшее время</p></div></div>',
    });

    if (error === 0) {
      form.classList.add("_sending");
      let response = await fetch("/tg.php", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (response.ok) {
        await response.json();
        modal.show();
        form.reset();
        form.classList.remove("_sending");
      } else {
        console.log("Ошибка");
        form.classList.remove("_sending");
      }
    }
  }

  const modalForm = document.getElementById("modalForm");
  modalForm.addEventListener("submit", modalFormSend);

  async function modalFormSend(e) {
    e.preventDefault();

    let error = modalFormValidate(modalForm);

    let formData = new FormData(modalForm);

    if (error === 0) {
      modalForm.classList.add("_sending");
      let response = await fetch("/tg.php", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (response.ok) {
        await response.json();
        modalForm.reset();
        modalForm.classList.remove("_sending");
        modalForm.classList.add("_hidden");
        modalForm.previousElementSibling.classList.add("_hidden");
        modalForm.nextElementSibling.classList.add("_success");
      } else {
        console.log("Ошибка");
        modalForm.classList.remove("_sending");
      }
    } else {
      console.log(error);
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("._req");

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.value === "") {
        formAddError(input);
        error++;
      }
    }
    return error;
  }

  function modalFormValidate(modalForm) {
    let error = 0;
    let modalFormReq = document.querySelectorAll("._modalreq");

    for (let index = 0; index < modalFormReq.length; index++) {
      const input = modalFormReq[index];
      formRemoveError(input);

      if (input.value === "") {
        formAddError(input);
        error++;
      }
    }
    return error;
  }
  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
    input.nextElementSibling.classList.add("_error");
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
    input.nextElementSibling.classList.remove("_error");
  }
});
