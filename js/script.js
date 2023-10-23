window.addEventListener("DOMContentLoaded", () => {
  //TABS
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabContent = document.querySelectorAll(".tabcontent"),
    tabParent = document.querySelector(".tabheader__items");

  function hideContent() {
    tabContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }
  function showContent(i = 0) {
    tabContent[i].classList.add("show", "fade");
    tabContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }
  hideContent();
  showContent();

  tabParent.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideContent();
          showContent(i);
        }
      });
    }
  });

  //TIMER

  const deadline = "2025-12-31";

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const t = Date.parse(endtime) - Date.parse(new Date());

    if (t < 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      (days = Math.floor(t / (1000 * 60 * 60 * 24))), // милисекунд в сутках
        (hours = Math.floor((t / (1000 * 60 * 60)) % 24)), // милисекунд в часе
        (minutes = Math.floor((t / 1000 / 60) % 60)), // милисекунд в минуте
        (seconds = Math.floor((t / 1000) % 60)); // милисекунд в секунде
    }
    return {
      //возвращаю объект
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    //добавить 0 в таймер перед цифрой
    if (num >= 0 && num <= 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock(); // убирает мигание даты по дефолту при перезагрузке

    function updateClock() {
      const t = getTimeRemaining(endtime);
      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }
  setClock(".timer", deadline);

  // MODAL
  const modal = document.querySelector(".modal"),
    // modalClose = document.querySelectorAll("[data-close]"),
    modalShow = document.querySelectorAll("[data-modal]");

  function openModal() {
    modal.classList.toggle("show");
    document.body.style.overflow = "hidden"; //отменяет скрол страницы
    clearInterval(modalTimerId); //не открывает модалку по таймеру усли пользователь уже открывал модалку
  }
  modalShow.forEach((item) => {
    item.addEventListener("click", openModal);
  });

  function closeModal() {
    modal.classList.toggle("show");
    document.body.style.overflow = "";
  }
  // modalClose.forEach((item) => {
  //   item.addEventListener("click", closeModal);
  // });

  //закрыть кнопкой esc
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      //гуглить e.code
      closeModal();
    }
  });

  //закрыть модалку при клике по экрану а не Х
  modal.addEventListener("click", (e) => {
    //e объект события
    if (e.target === modal || e.target.getAttribute('data-close' == '')) {
      closeModal();
      // modal.classList.toggle("show");
      //     document.body.style.overflow = "";
    }
  });

  const modalTimerId = setTimeout(openModal, 5000);

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 1
    ) {
      // без -1 на некоторых экранах не работает
      openModal();
      window.removeEventListener("scroll", showModalByScroll); // удаеляет открытие модалко во 1 раз в конце страницы
    }
  }
  window.addEventListener("scroll", showModalByScroll); //откроет модалку когда страница отмотана вниз

  // классы для карточек
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      //...classes массив
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector); //куда вставлять элемент
      this.transfer = 75; //курс $
      this.changeToRUB();
      this.classes = classes;
    }
    changeToRUB() {
      //конвертация цены в рубли
      this.price = this.price * this.transfer;
    }
    render() {
      //формирует верстку
      const element = document.createElement("div");
      if (this.classes.length === 0) {
        this.element = "menu__item";
        element.classList.add(this.element);
      } else {
        this.classes.forEach((classList) => element.classList.add(className));
      }

      element.innerHTML = `
<img src=${this.src} alt=${this.alt}>
<h3 class="menu__item-subtitle">${this.title}</h3>
<div class="menu__item-descr">${this.descr}</div>
<div class="menu__item-divider"></div>
<div class="menu__item-price">
    <div class="menu__item-cost">Цена:</div>
    <div class="menu__item-total"><span>${this.price}</span> &#8381/день</div>
</div>`;
      this.parent.append(element); //append вставить в конец какого-либо элемента другой элемент
    }
  }
  // const div = new MenuCard()
  // div.render()
  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    5,
    ".menu .container" //<div class="menu"> <div class="container">
    // "menu__item" //добавляется класс благодаря rest оператору
  ).render();
  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    "Меню “Премиум”",
    "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
    9,
    ".menu .container" //<div class="menu"> <div class="container">
  ).render();
  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    "Меню “Постное”",
    "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
    7,
    ".menu .container" //<div class="menu"> <div class="container">
  ).render();

  //FORMS
  const forms = document.querySelectorAll("form"); // получаем все формы
  const message = {
    // список фраз о происходящем
    loading: "Загрузка",
    success: "Спасибо! Скоро с вами свяжемся",
    failure: "Что то пошло не так.........",
  };
  forms.forEach((item) => {
    postData(item);
  });

  function postData(form) {
    // постит данные
    form.addEventListener("submit", (e) => {
      // submit отправить
      e.preventDefault(); // что бы не перезагужать страницу каждый раз при перезагрузке

      const statusMessage = document.createElement("div");
      statusMessage.classList.add("status");
      statusMessage.textContent = message.loading; // загрузка
      form.append(statusMessage); // добавить сообщение к форме

      const request = new XMLHttpRequest(); //встроенный в браузер объект, который даёт возможность делать HTTP-запросы к серверу без перезагрузки страницы.
      request.open("POST", "server.php"); //метод и путь

      request.setRequestHeader("Content-type", "application/json"); // отправка данных в JSON
      const formData = new FormData(form); // что бы работало у инпутов обязательно должны быть имена

      //перевод данных  в JSON
      const obj = {}; // получаем объект данных
      formData.forEach(function (value, key) {
        obj[key] = value;
      });
      const json = JSON.stringify(obj); // конвертируем в JSON

      request.send(json); //отправка данных уже а json
      request.addEventListener("load", () => {
        // отслеживаем конечную загруку
        if (request.status === 200) {
          // запрос что ок
          console.log(request.response);
          statusMessage.textContent = message.success; //  все ок
          form.reset(); //очистить форму
          setTimeout(() => {
            // удалить statusMessage
            statusMessage.remove();
          }, 2000);
        } else {
          statusMessage.textContent = message.failure; // ошибка
        }
      });
    });
  }

  function showThanksModal() {
    const prevModalDialog = document.querySelector("modal__dialog");
    
    prevModalDialog.classList.add('hide') //скрывам предыдущий контент
    openModal()

    const thanksModal = document.createElement('div') 
    thanksModal.classList.add('modal__dialog')
    thanksModal.innerHTML = `
    <div class="modal__content">
    <div class="modal__close" data-close>${message}</div>
    <div class=""></div>
    </div>
    `;
    document.querySelector('.modal').append(thanksModal)
  }
});
