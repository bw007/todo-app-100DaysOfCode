// Class

class Todo {
  constructor(collection, data) {
    this.collection = collection;
    this.data = data;
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

    let nav = document.querySelector("#list");
    let tags = ["more", "study", "daily-routine"].reverse();
    nav.innerHTML = "";
    tags.forEach(item => {
      nav.innerHTML += `
        <a class="sidebar__link" href="#${item}">
          ${item.split("-").join(" ")}
          <span class="count" id="daily">3</span>
        </a>
      `
    });

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
          if (item.type == "select") {
            let select = document.createElement("select");
            select.classList.add("modal__select");
            select.setAttribute("required", item.req);
            select.setAttribute("name", item.name);
            tags.forEach(opt => {
              
              let option = document.createElement("option")
              option.textContent = opt.split("-").join(" ");
              option.value = opt;
              select.appendChild(option);
            });
            
            modalForm.appendChild(select);
          } else {
            let input = document.createElement("input");
            input.classList.add("modal__input");
            input.setAttribute("required", item.req);
            input.setAttribute("type", item.type);
            input.setAttribute("name", item.name);
            input.placeholder = item.text;
            modalForm.append(input);
          }
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
            data.id = Date.now();
            data[name] = value;
            data.status = false;
            data.createdTime = new Date();
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

            const storedData = localStorage.getItem("data");

            if (storedData) {
              this.data = JSON.parse(storedData);
            } else {
              this.data = [{ ...data }];
              localStorage.setItem("data", JSON.stringify(this.data));
            }
            
            const { hash } = window.location;
            const currentDate = convertDate(new Date());

            const filteredData = this.data.filter(item => {
              switch (hash) {
                case "#all":
                  return true;
                case "#today":
                  return convertDate(item.deadline) === currentDate;
                default:
                  return item.tag === hash.slice(1);
              }
            });

            setTimeout(() => {
              this.render(filteredData);
            }, 100);
          }
        }
      }
    }
  }

  render(data) {
    const wrap = document.querySelector(".wrap__inner");
    wrap.innerHTML = "";

    let links = document.querySelectorAll(".sidebar__link");

    let list = document.querySelector(".wrap__list");
    if (list) {
      
    } else {
      list = document.createElement("div");
      list.classList.add("wrap__list");

      data.forEach((item, i) => {
        let el = document.createElement("div");
        el.classList.add("wrap__item");
        
        let inp = document.createElement("input");
        inp.setAttribute("type", "checkbox");
        inp.setAttribute("name", "check");
        inp.setAttribute("id", i);
        inp.checked = item.status;

        inp.onchange = (e) => {
          this.data = [ 
            ...JSON.parse(localStorage.getItem("data")).map(unq => {
              if (unq.id != item.id) return unq;
              return { ...unq, status: !unq.status }
            })
          ];
          localStorage.setItem("data", JSON.stringify(this.data));
        }

        let lb = document.createElement("label");
        lb.setAttribute("for", i);
        lb.classList.add("wrap__item-check");

        let sp = document.createElement("span");
        sp.textContent = item.title;

        let p = document.createElement("p");
        p.textContent = item.desc;

        let a = document.createElement("a");
        a.setAttribute("href", `#${item.tag}`);
        a.textContent = item.tag?.split("-").join(" ");

        a.onclick = () => {
          window.location = `#${item.tag}`;
          links.forEach(link => {
            link.classList.toggle("sidebar__link--active", link.getAttribute("href") == `#${item.tag}`)
          });

          this.render(JSON.parse(localStorage.getItem("data")).filter(f => f.tag == item.tag));
        }

        el.append(inp, lb, sp, p, a);
        list.appendChild(el);
      });
      
      wrap.appendChild(list)
    }
  }
}