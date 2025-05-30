const tg = window.Telegram.WebApp;

const products = [
  {
    id: "bravecto1",
    name: "Бравекто 2-4.5 кг",
    price: 2950,
    img: 'images/bravecto-small.jpg' 
  },
  {
    id: "bravecto2",
    name: "Бравекто 4.5-10 кг",
    price: 3100,
    img: 'images/bravecto-medium.jpg'
  },
  {
    id: "bravecto3",
    name: "Бравекто 10-20 кг",
    price: 3250,
    img: 'images/bravecto-10-20.jpg'
  },
  {
    id: "bravecto4",
    name: "Бравекто 20-40 кг",
    price: 3400,
    img: 'images/bravecto-20-40.jpg'
  },
  {
    id: "bravecto5",
    name: "Бравекто 40-56 кг",
    price: 3700,
    img: 'images/bravecto-40-56.jpg'
  },
  {
    id: "simparika1",
    name: "Симпарика 1.3-2.5 кг",
    price: 2850,
    img: 'images/simparica-1-2.jpg
  },
  {
    id: "simparika2",
    name: "Симпарика 2.5-5 кг",
    price: 3000,
    img: 'images/simparica-2-5.jpg
  },
  {
    id: "simparika3",
    name: "Симпарика 5-10 кг",
    price: 3150,
    img: 'images/simparica-5-10.jpg
  },
  {
    id: "simparika4",
    name: "Симпарика 10-20 кг",
    price: 3300,
    img: 'images/simparica-10-20.jpg
  },
  {
    id: "simparika5",
    name: "Симпарика 20-40 кг",
    price: 3450,
    img: 'images/simparica-20-40.jpg
  }
];

const productsDiv = document.getElementById("products");
const deliverySelect = document.getElementById("delivery");
const addressBlock = document.getElementById("addressBlock");
const submitBtn = document.getElementById("submit");
const totalPriceEl = document.getElementById("totalPrice");

let order = {}; // {id: quantity}

function renderProducts() {
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>Цена: ${p.price} ₽</p>
        <label>Количество:
          <input type="number" min="0" value="0" data-id="${p.id}" style="width: 60px;" />
        </label>
      </div>
    `;
    productsDiv.appendChild(div);
  });
}

function updateOrder() {
  order = {};
  let total = 0;

  productsDiv.querySelectorAll("input[type=number]").forEach(input => {
    const qty = +input.value;
    const id = input.dataset.id;
    if (qty > 0) {
      order[id] = qty;
      const price = products.find(p => p.id === id).price;
      total += price * qty;
    }
  });

  totalPriceEl.textContent = `Итого: ${total} ₽`;
}

function validateForm() {
  if (Object.keys(order).length === 0) {
    alert("Выберите хотя бы один препарат.");
    return false;
  }
  if (!deliverySelect.value) {
    alert("Выберите способ доставки.");
    return false;
  }
  if (deliverySelect.value === "Доставка") {
    const address = document.getElementById("address").value.trim();
    if (!address) {
      alert("Введите адрес доставки или ПВЗ.");
      return false;
    }
  }
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    alert("Введите имя и телефон.");
    return false;
  }
  return true;
}

function getOrderData() {
  return {
    items: Object.entries(order).map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      return { name: product.name, qty, price: product.price, total: product.price * qty };
    }),
    delivery: deliverySelect.value,
    address: deliverySelect.value === "Доставка" ? document.getElementById("address").value.trim() : "Самовывоз",
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
  };
}

deliverySelect.addEventListener("change", () => {
  if (deliverySelect.value === "Доставка") {
    addressBlock.style.display = "block";
  } else {
    addressBlock.style.display = "none";
  }
});

productsDiv.addEventListener("input", updateOrder);

submitBtn.addEventListener("click", () => {
  updateOrder();
  if (!validateForm()) return;

  const data = getOrderData();

  // Отправляем данные в Telegram боту
  tg.sendData(JSON.stringify(data));

  alert("Спасибо! Ваш заказ отправлен менеджеру.");

  // Можно очистить форму или закрыть миниапп
  tg.close();
});

renderProducts();

