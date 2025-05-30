document.addEventListener('DOMContentLoaded', () => {
  // Глобальные переменные
  window.cartButton = document.getElementById('cart-button');
  window.cartPopup = document.getElementById('cartPopup');
  window.cartItemsList = document.getElementById('cartItemsList');
  window.cartTotalPrice = document.getElementById('cartTotalPrice');
  window.cartCloseBtn = document.getElementById('cartCloseBtn');

  window.cartAddPopup = document.getElementById('cartAddPopup');
  window.cartAddText = document.getElementById('cartAddText');
  window.cartAddMoreBtn = document.getElementById('cartAddMoreBtn');
  window.cartAddCloseBtn = document.getElementById('cartAddCloseBtn');

  window.checkoutBtn = document.querySelector('#cartPopup .popup-checkout-btn'); // Кнопка "Заказать"
  window.bookingSection = document.querySelector('.reserve-section'); // Секция бронирования

  window.cartItems = [];

  // Функция для склонения числительных
  window.declOfNum = function (number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  };

  // Функция для отображения списка товаров и общей стоимости
  window.renderCartItems = function () {
    cartItemsList.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
      cartItemsList.textContent = 'Корзина пуста';
      cartTotalPrice.textContent = 'Итого: 0 ₽';
      return;
    }

    cartItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.textContent = `${item.name} — ${item.price} ₽ × ${item.quantity}`;
      cartItemsList.appendChild(itemDiv);

      total += item.quantity * Number(item.price);
    });

    cartTotalPrice.textContent = `Итого: ${total} ₽`;
  };

  // Функция для открытия попапа корзины
  window.showCartPopup = function () {
    if (cartItems.length === 0) {
      alert('Ваша корзина пуста');
      return;
    }
    renderCartItems();
    cartPopup.classList.remove('d-none');
  };

  // Функция для закрытия попапа корзины
  window.closeCartPopup = function () {
    cartPopup.classList.add('d-none');
  };

  // Функция для открытия попапа "Товар добавлен в корзину"
  window.showCartAddPopup = function (productName) {
    cartAddText.textContent = `Товар "${productName}" добавлен в корзину`;
    cartAddPopup.classList.remove('d-none');
  };

  // Функция для закрытия попапа "Товар добавлен в корзину"
  window.closeCartAddPopup = function () {
    cartAddPopup.classList.add('d-none');
  };

  // Очистка корзины
  window.clearCart = function () {
    cartItems.length = 0; // Очищаем массив товаров
    renderCartItems(); // Обновляем отображение корзины
  };

  // Добавление товара в корзину
  document.querySelectorAll('.card-slider .cart-icon').forEach(icon => {
    icon.addEventListener('click', e => {
      e.stopPropagation();
      const card = icon.closest('.card-slider');
      const productName = card.querySelector('.card-title').textContent.split(' ')[0];
      const productPrice = card.querySelector('.card-title').textContent.split(' ')[1];

      const existingItem = cartItems.find(item => item.name === productName);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push({ name: productName, price: productPrice, quantity: 1 });
      }

      showCartAddPopup(productName);
    });
  });

  // Кнопка "Добавить ещё"
  cartAddMoreBtn.addEventListener('click', () => {
    const productName = cartAddText.textContent.split('"')[1]; // Получаем название товара из текста попапа
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
      existingItem.quantity++; // Увеличиваем количество товара
    }

    closeCartAddPopup(); // Закрываем попап "Товар добавлен в корзину"
  });

  // Кнопка "Закрыть" в попапе "Товар добавлен в корзину"
  cartAddCloseBtn.addEventListener('click', () => {
    closeCartAddPopup();
  });

  // Кнопка открытия корзины
  cartButton.addEventListener('click', showCartPopup);

  // Кнопка закрытия корзины
  cartCloseBtn.addEventListener('click', closeCartPopup);

  // Кнопка "Заказать"
  checkoutBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert('Ваша корзина пуста');
      return;
    }

    clearCart(); // Очищаем корзину
    closeCartPopup(); // Закрываем попап корзины

    if (bookingSection) {
      bookingSection.style.display = 'block'; // Показываем секцию бронирования
      bookingSection.scrollIntoView({ behavior: 'smooth' }); // Перемещаемся к секции
    }
  });
});