// Class

class Todo {
  collection = [];
  tags = [];
  menu = [];
  data = [];
  constructor(collection, tags, menu, data) {
    this.collection = collection;
    this.tags = tags?.reverse();
    this.menu = menu;
    this.data = data;
  }

  // Create sidebar menu
  createMenu() {
    const firstNav = document.querySelector("#first"),
      lastNav = document.querySelector("#last");

    this.data = JSON.parse(localStorage.getItem("data")) || [];
    
    firstNav.innerHTML = "";
    this.menu.forEach(item => {
      firstNav.innerHTML += `
        <a class="sidebar__link" id="link" href="#${item}">
          ${item.split("-").join(" ")}
          <span class="count" id="daily">
            ${ item == "today"
              ? this.data?.filter(f => convertDate(f.deadline) == convertDate(new Date())).length ?? 0 
              : this.data?.length ?? 0 
            }
          </span>
        </a>
      `
    })

    lastNav.innerHTML = "";
    this.tags.forEach(item => {
      lastNav.innerHTML += `
        <a class="sidebar__link" id="link" href="#${item}">
          ${item.split("-").join(" ")}
          <span class="count" id="daily">
            ${ this.data?.filter(f => f.tag == item).length ?? 0 }
          </span>
        </a>
      `
    });

    const links = document.querySelectorAll(".sidebar__link");
    const logo = document.querySelector(".sidebar__logo");

    const home = document.querySelector(".sidebar__nav [href='#today']");

    logo.onclick = () => {
      for (const item of links) {
        item.classList.remove("sidebar__link--active");
      }
      home.classList.add("sidebar__link--active");
      this.getStoredData(home.getAttribute("href"), this.data)
    }

    links.forEach(el => {
      el.classList.toggle("sidebar__link--active", el.getAttribute("href") === window.location.hash);

      el.onclick = (e) => {
        for (const item of links) {
          item.classList.remove("sidebar__link--active");
        }

        el.classList.add("sidebar__link--active");
        this.getStoredData(el.getAttribute("href"), this.data)
      }
    });
  }
  // ------------------

  // Notification
  notifMessage(type) {
    let cls = type == "error" ? "danger" : "success";
    let msg = type == "new" ? "Added successfully!" 
      : type == "edit" ? "Edited successfully" 
      : type;

    let notif = document.querySelector(".notif");
    const notifText = document.createElement("p"),
      icon = document.createElement("img"),
      closeIcon = document.createElement("img");
    icon.src = `./imgs/${type == "error" ? "danger" : "success"}.svg`;
    closeIcon.src = "./imgs/close.svg";

    if (!notif) {
      notif = document.createElement("div");
      notif.classList.add("notif");
      document.body.append(notif);
    }
    
    notif.innerHTML = "";
    setTimeout(() => {
      notif.classList.add(cls);
    }, 150);
    notifText.textContent = msg;

    notif.append(icon, notifText, closeIcon);

    const time = setTimeout(() => {
      notif.classList.remove(cls);
    }, 4000);

    closeIcon.onclick = () => {
      notif.classList.remove(cls);
      clearTimeout(time);
    }
  }
  // -----------

  // Create modal
  createModal(type, id) {
    const main = document.querySelector(".main");
    let modal = document.querySelector(".modal");
    
    if (modal) {
      if (modal.classList.contains("modal__hidden")) {
        modal.classList.remove("modal__hidden");
      }
    } else {
      modal = document.createElement("div");
      modal.classList.add("modal");    
    }
    modal.innerHTML = "";

    let modalbox = document.createElement("div");
      modalbox.classList.add("modal__box");

      let modalTitle = document.createElement("h1");
      modalTitle.classList.add("modal__title");
      modalTitle.textContent = `${type} task`;

      let modalForm = document.createElement("form");
      modalForm.classList.add("modal__form");

      this.collection.forEach(item => {
        if (item.type == "select") {
          let select = document.createElement("select");
          select.classList.add("modal__select");
          select.setAttribute("required", item.req);
          select.setAttribute("name", item.name);
          this.tags.forEach(opt => {
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
      submit.textContent = type == "new" ? "create" : type;

      btnParent.append(cancel, submit);
      modalForm.appendChild(btnParent);
      modalbox.append(modalTitle, modalForm);

      modal.appendChild(modalbox);
      main.appendChild(modal)

      var inputs = document.querySelectorAll('.modal__input');
      const storedData = JSON.parse(localStorage.getItem("data"));

      if (id) {
        const data = storedData.find(item => item.id == id);
        for (const key in data) {
          let inputElement = modalForm.querySelector(`[name="${key}"]`);
            if (inputElement) {
              inputElement.value = data[key];
            }
        }
      }

      modal.onclick = (e) => {
        if (e.target.classList.contains("modal")) {
          modal.classList.add("modal__hidden");
          inputs.forEach(el => {
            el.classList.remove("modal__input--danger")
          });
        }
      }

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

          if (type == "edit" && id) {
            this.data = [ 
              ...storedData.map(item => {
                if (item.id != id) return item;
                return { ...data, status: item.status, id: item.id };
              })
            ]
          } else if (!id && storedData) {
            this.data = [ { ...data }, ...storedData ];
          } else {
            this.data = [ { ...data } ];
          }
          localStorage.setItem("data", JSON.stringify(this.data));

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
            this.notifMessage(type);
            this.createMenu();
            this.renderStoredData(filteredData);
          }, 100);
        }
      }
  }
  // ----------------

  // Create modal and save data
  addData() {
    const main = document.querySelector(".main");
    let addBtn = document.querySelector(".add");

    if (!addBtn) {
      addBtn = document.createElement("button");
      addBtn.classList.add("add");
      addBtn.textContent = "+";
      main.append(addBtn);
    }

    addBtn.onclick = (e) => {
      this.createModal("new");
    };
  }
  // --------------------

  // Filter stored data
  getStoredData(hash, data) {
    let title = document.querySelector(".wrap__title");
    title.textContent = hash.slice(1).split("-").join(" ");

    if (data.length) {
      if (this.tags.includes(hash.slice(1))) {
        this.renderStoredData(data.filter(item => item.tag == hash.slice(1)));
      } else {
        switch (hash) {
          case "#today":
            this.renderStoredData(data.filter(item => convertDate(item.deadline) == convertDate(new Date())));
            break;
          case "#all":
            this.renderStoredData(data);
            break;
        }
      }
    } else {
      const list = document.querySelector(".wrap__inner");
      let empty = document.createElement("div");
      empty.classList.add("wrap__empty");

      const emptyText = document.createElement("h4");
      emptyText.textContent = "Nothing here yet...";

      const emptyImg = document.createElement("img");
      emptyImg.setAttribute("src", "./imgs/empty.png");

      empty.append(emptyImg, emptyText);
      list.innerHTML = "";
      list.appendChild(empty);
    }
  }
  // --------------------------

  // Render stored data in page
  renderStoredData(data) {
    const wrap = document.querySelector(".wrap__inner");
    wrap.innerHTML = "";

    let links = document.querySelectorAll(".sidebar__link");

    let list = document.querySelector(".wrap__list");
    if (!list) {
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
            ...JSON.parse(localStorage.getItem("data")).map(i => {
              if (i.id != item.id) return i;
              return { ...i, status: !i.status }
            })
          ];
          localStorage.setItem("data", JSON.stringify(this.data));
          this.notifMessage("Status changed");
        }

        let lb = document.createElement("label");
        lb.setAttribute("for", i);
        lb.classList.add("wrap__item-check");

        let sp = document.createElement("span");
        sp.textContent = item.title;
        sp.title = item.title;

        let p = document.createElement("p");
        p.textContent = item.desc;
        p.title = item.desc;

        let a = document.createElement("a");
        a.setAttribute("href", `#${item.tag}`);
        a.textContent = item.tag?.split("-").join(" ");
        a.title = item.tag?.split("-").join(" ");

        a.onclick = () => {
          window.location = `#${item.tag}`;
          links.forEach(link => {
            link.classList.toggle("sidebar__link--active", link.getAttribute("href") == `#${item.tag}`)
          });
          this.renderStoredData(JSON.parse(localStorage.getItem("data")).filter(f => f.tag == item.tag));
        }

        let del = document.createElement("button");
        del.title = "Remove";
        del.innerHTML = `<img src='./imgs/trash.svg'>`
        
        del.onclick = () => {
          this.data = [ ...JSON.parse(localStorage.getItem("data")).filter(f => f.id != item.id) ];
          localStorage.setItem("data", JSON.stringify(this.data));
          setTimeout(() => {
            this.getStoredData(window.location.hash, this.data);
          }, 100);
          this.createMenu();
          this.notifMessage("Deleted successfully")
        }

        let edit = document.createElement("button");
        edit.title = "Edit";
        edit.innerHTML = `<img src='./imgs/edit.svg'>`

        edit.onclick = () => {
          this.createModal("edit", item.id);
        }

        el.append(inp, lb, sp, p, a, del, edit);
        list.appendChild(el);
      });
      
      wrap.appendChild(list);
    }
  }
  // -----------------
}