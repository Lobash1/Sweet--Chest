import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// order.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.order-form');
  const input = document.querySelector('.order-input');
  const checkbox = document.querySelector('.order-checkbox');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const phone = input.value.trim();

    // Перевірка: чи заповнено поле
    if (!phone) {
      iziToast.error({
        title: 'Error',
        message: 'Please enter your phone number.',
        position: 'topRight',
      });
      return;
    }

    // Перевірка формату номера (проста валідація)
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      iziToast.warning({
        title: 'Invalid number',
        message: 'Please enter a valid phone number.',
        position: 'topRight',
      });
      return;
    }

    // Перевірка чекбокса
    if (!checkbox.checked) {
      iziToast.warning({
        title: 'Consent required',
        message: 'Please agree to personal data processing.',
        position: 'topRight',
      });
      return;
    }

    // Успішна відправка (імітація)
    iziToast.success({
      title: 'Success',
      message: 'Your order request has been sent! We’ll call you back soon 💛',
      position: 'topRight',
    });

    // Очистити форму
    form.reset();
  });
});
