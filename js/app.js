class Todo {
  constructor(collection) {
    this.collection = collection;
  }

  createModal() {
    const main = document.querySelector(".main");
    let addBtn = document.querySelector(".add");

    if (addBtn) {
      
    } else {
      addBtn = document.createElement("button");
      addBtn.classList.add("add");
      addBtn.textContent = "+";
      main.append(addBtn)
    }

    addBtn.onclick = (e) => {
      let modal = document.querySelector(".modal");

      if (modal) {
        if (modal.classList.contains("modal__hidden")) {
          modal.classList.remove("modal__hidden");
        }
      } else {
        modal = document.createElement("div");
        modal.classList.add("modal");

        modal.onclick = (e) => {
          if (e.target.classList.contains("modal")) {
            modal.classList.add("modal__hidden");
          }
        }

        let modalbox = document.createElement("div");
        modalbox.classList.add("modal__box");

        let modalTitle = document.createElement("h1");
        modalTitle.classList.add("modal__title");
        modalTitle.textContent = "New task";

        let modalForm = document.createElement("form");
        modalForm.classList.add("modal__form");

        this.collection.forEach(item => {
          let input = document.createElement("input");
          input.classList.add("modal__input");
          input.setAttribute("required", item.req);
          input.setAttribute("type", item.type);
          input.setAttribute("name", item.name);
          input.placeholder = item.text;
          modalForm.append(input);
        });

        let btnParent = document.createElement("div");
        btnParent.classList.add("modal__btns");

        let cancel = document.createElement("button");
        cancel.classList.add("modal__btn", "modal__btn--danger");
        cancel.textContent = "Cancel";
        
        let submit = document.createElement("button");
        submit.setAttribute("type", "submit");
        submit.classList.add("modal__btn", "modal__btn--success");
        submit.textContent = "Create";

        btnParent.append(cancel, submit);
        modalForm.appendChild(btnParent);
        modalbox.append(modalTitle, modalForm);

        modal.appendChild(modalbox);
        main.appendChild(modal)

        var inputs = document.querySelectorAll('.modal__input');

        cancel.onclick = (e) => {
          e.preventDefault();
          
          modalForm.reset();

          inputs.forEach(el => {
            el.classList.remove("modal__input--danger")
          });

          setTimeout(() => {
            modal.classList.add("modal__hidden");
          }, 100);
        };

        submit.onclick = (e) => {
          e.preventDefault();
          
          let data = {};
          let form = new FormData(modalForm);

          form.forEach((value, name) => {
            data[name] = value;
          });
          
          
          let inp = 0;
          inputs.forEach(el => {
            if (!el.value.trim()) {
              el.classList.add("modal__input--danger")
            } else {
              inp++;
              el.classList.remove("modal__input--danger")
            }
          });

          if (inp == 3) {
            modalForm.reset();
            inputs.forEach(el => {
              el.classList.remove("modal__input--danger")
            });
            modal.classList.add("modal__hidden");
            setTimeout(() => {
              this.render(data)
            }, 100);
          }

        }

      }

    }

  }

  render(...data) {
    const wrap = document.querySelector(".wrap__inner");
    console.log(data);
    wrap.innerHTML = "";

    let list = document.querySelector(".wrap__list");
    if (list) {
      
    } else {
      list = document.createElement("div");
      list.classList.add("wrap__list");

      data.forEach(item => {
        let el = document.createElement("div");
        el.classList.add("wrap__item");
        
        let inp = document.createElement("input");
        inp.setAttribute("type", "checkbox");
        inp.setAttribute("name", "check");
        inp.setAttribute("id", "check");

        let lb = document.createElement("label");
        lb.setAttribute("for", "check");
        lb.classList.add("wrap__item-check");

        let sp = document.createElement("span").textContent = item.title;

        el.append(inp, lb, sp);
        list.appendChild(el);
      });

      wrap.appendChild(list)
    }

  }
}
