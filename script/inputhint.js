document.addEventListener('DOMContentLoaded', () => {
  // Функция для изменения плейсхолдера
  window.changePlaceholder = function (input, newPlaceholder) {
    input.placeholder = newPlaceholder;
  };

  // Функция для сброса плейсхолдера
  window.resetPlaceholder = function (input, originalPlaceholder) {
    input.placeholder = originalPlaceholder;
  };

  // Формат даты ДД.ММ.ГГГГ
  window.formatDate = function (value) {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    if (digits.length >= 2) {
      formatted += digits.slice(0, 2) + '.';
    } else {
      formatted += digits;
    }
    if (digits.length >= 4) {
      formatted += digits.slice(2, 4) + '.';
    } else if (digits.length > 2) {
      formatted += digits.slice(2);
    }
    if (digits.length > 4) {
      formatted += digits.slice(4);
    }
    return formatted;
  };

  // Формат времени ЧЧ:ММ
  window.formatTime = function (value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    let formatted = '';
    if (digits.length >= 2) {
      formatted += digits.slice(0, 2) + ':';
    } else {
      formatted += digits;
    }
    if (digits.length > 2) {
      formatted += digits.slice(2);
    }
    return formatted;
  };

  // Формат имени — первая буква заглавная (каждое слово)
  window.formatName = function (value) {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Формат телефона +7 (999) 999-99-99
  window.formatPhone = function (value) {
    let digits = value.replace(/\D/g, '').slice(0, 11);
    let formatted = '';
    if (digits.length > 0) formatted = '+7 ';
    if (digits.length > 1) formatted += '(' + digits.substring(1, 4);
    if (digits.length >= 4) formatted += ') ' + digits.substring(4, 7);
    if (digits.length >= 7) formatted += '-' + digits.substring(7, 9);
    if (digits.length >= 9) formatted += '-' + digits.substring(9, 11);
    return formatted;
  };

  // Автоформат при вводе
  const dataInput = document.getElementById('data');
  const timeInput = document.getElementById('time');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');

  if (dataInput) {
    dataInput.addEventListener('input', function () {
      this.value = formatDate(this.value);
    });
  }

  if (timeInput) {
    timeInput.addEventListener('input', function () {
      this.value = formatTime(this.value);
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', function () {
      this.value = formatName(this.value);
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      this.value = formatPhone(this.value);
    });
  }

  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    // Валидация email
    window.validateEmail = function (email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    // Валидация даты (ДД.ММ.ГГГГ)
    window.validateDate = function (date) {
      const parts = date.split('.');
      if (parts.length !== 3) return false;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
      if (year < 1900 || year > 2100) return false;
      if (month < 1 || month > 12) return false;
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) return false;
      return true;
    };

    // Валидация времени ЧЧ:ММ
    window.validateTime = function (time) {
      const parts = time.split(':');
      if (parts.length !== 2) return false;
      const hh = parseInt(parts[0], 10);
      const mm = parseInt(parts[1], 10);
      if (isNaN(hh) || isNaN(mm)) return false;
      if (hh < 0 || hh > 23) return false;
      if (mm < 0 || mm > 59) return false;
      return true;
    };

    // Функция валидации формы
    window.validateForm = function () {
      const dataInput = document.getElementById('data');
      const timeInput = document.getElementById('time');
      const nameInput = document.getElementById('name');
      const phoneInput = document.getElementById('phone');
      const emailInput = document.getElementById('email');

      let isValid = true;

      if (!validateDate(dataInput?.value)) {
        isValid = false;
        setError(dataInput, 'error-data', 'Введите корректную дату ДД.ММ.ГГГГ');
      }

      if (!validateTime(timeInput?.value)) {
        isValid = false;
        setError(timeInput, 'error-time', 'Введите корректное время ЧЧ:ММ');
      }

      if (!nameInput?.value.trim() || nameInput.value.trim().length < 2) {
        isValid = false;
        setError(nameInput, 'error-name', 'Введите корректное имя');
      }

      const phoneDigits = phoneInput?.value.replace(/\D/g, '');
      if (phoneDigits?.length !== 11 || phoneDigits?.charAt(0) !== '7') {
        isValid = false;
        setError(phoneInput, 'error-phone', 'Введите корректный номер телефона');
      }

      if (emailInput?.value.trim() && !validateEmail(emailInput.value.trim())) {
        isValid = false;
        setError(emailInput, 'error-email', 'Введите корректный email');
      }

      return isValid;
    };

    // Обработка отправки формы бронирования
    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Очистка ошибок
      const errorIds = ['data', 'time', 'name', 'phone', 'email'];
      errorIds.forEach(id => {
        const errorElement = document.getElementById('error-' + id);
        const inputElement = document.getElementById(id);

        if (errorElement && inputElement) {
          errorElement.textContent = '';
          inputElement.classList.remove('error');
        }
      });

      // Вызов функции валидации
      if (validateForm()) {
        showPopup();
      }
    });
  }

  // Установка сообщения об ошибке
  function setError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (input && errorElement) {
      errorElement.textContent = message;
      input.classList.add('error');
    }
  }

  // Генерация номера брони
  window.generateBookingNumber = function () {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters.charAt(Math.floor(Math.random() * letters.length));
    const numbers = Math.floor(1000 + Math.random() * 9000);
    return letter + numbers;
  };

  // Генерация номера столика
  window.generateTableNumber = function () {
    return Math.floor(1 + Math.random() * 10);
  };

  // Показ попапа
  window.showPopup = function () {
    const bookingNumber = generateBookingNumber();
    const tableNumber = generateTableNumber();
    const popup = document.getElementById('bookingPopup');
    const popupText = document.getElementById('bookingPopupText');

    popupText.innerHTML = `Ваш номер брони: <strong>${bookingNumber}</strong><br>Столик № <strong>${tableNumber}</strong>`;
    popup.classList.remove('d-none');
  };

  // Кнопка закрытия попапа
  window.closePopup = function () {
    const popup = document.getElementById('bookingPopup');
    popup.classList.add('d-none');
  };
});