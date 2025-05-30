const cart = [];

const products = [
  { name: 'Бравекто 2–4.5 кг', price: 2950, image: 'images/bravecto-small.jpg' },
  { name: 'Бравекто 4.5–10 кг', price: 3100, image: 'images/bravecto-medium.jpg' },
  { name: 'Бравекто 10–20 кг', price: 3250, image: 'images/bravecto-10-20.jpg' },
  { name: 'Бравекто 20–40 кг', price: 3400, image: 'images/bravecto-20-40.jpg' },
  { name: 'Бравекто 40–56 кг', price: 3700, image: 'images/bravecto-40-56.jpg' },

  { name: 'Симпарика 1.3–2.5 кг', price: 2850, image: 'images/simparica-1-2.jpg' },
  { name: 'Симпарика 2.5–5 кг', price: 3000, image: 'images/simparica-2-5.jpg' },
  { name: 'Симпарика 5–10 кг', price: 3150, image: 'images/simparica-5-10.jpg' },
  { name: 'Симпарика 10–20 кг', price: 3300, image: 'images/simparica-10-20.jpg' },
  { name: 'Симпарика 20–40 кг', price: 3450, image: 'images/simparica-20-40.jpg' },
];

const catalog = document.getElementById('catalog');

products.forEach(p => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <div class="info">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button onclick="addToCart('${p.name}', ${p.price})">Добавить</button>
    </div>
  `;
  catalog.appendChild(card);
});

function addToCart(name, price) {
  cart.push({ name, price });
  alert(`Добавлено: ${name}`);
}

const deliveryRadios = document.getElementsByName("delivery");
deliveryRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    document.getElementById("addressFields").style.display =
      radio.value === "Доставка" ? "block" : "none";
  });
});

function submitOrder() {
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;

  if (!phone.trim()) {
    alert("Введите номер телефона!");
    return;
  }

  const orderText = `
🛒 Заказ:
${cart.map(c => `• ${c.name} — ${c.price}₽`).join('\n')}
💰 Итого: ${cart.reduce((sum, c) => sum + c.price, 0)}₽

🚚 Получение: ${delivery}
📍 Адрес: ${delivery === 'Доставка' ? address : 'Самовывоз'}
📞 Телефон: ${phone}
  `;

  if (window.Telegram.WebApp) {
    Telegram.WebApp.sendData(orderText);
    Telegram.WebApp.close();
  } else {
    alert("Telegram WebApp не инициализирован");
  }
}
