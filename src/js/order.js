import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.order-form');
  if (!form) {
    console.warn('❌ Форма .order-form не найдена');
    return;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const phoneInput = form.querySelector('input[name="phone"]');
    const phone = phoneInput?.value.trim();
    const checkbox = document.querySelector('.order-checkbox');

    if (!phone) {
      iziToast.error({
        title: 'Error',
        message: 'Please enter your phone number.',
        position: 'topRight',
      });
      return;
    }

    const phoneRegex = /^\+?\d[\d\s\-\(\)]{8,}$/;
    if (!phoneRegex.test(phone)) {
      iziToast.warning({
        title: 'Invalid number',
        message: 'Please enter a valid phone number.',
        position: 'topRight',
      });
      return;
    }

    // ✅ Обязательное согласие с чекбоксом
    if (!checkbox || !checkbox.checked) {
      iziToast.warning({
        title: 'Consent required',
        message: 'Please agree to personal data processing before sending.',
        position: 'topRight',
      });
      return;
    }

    // === Отправка на сервер ===
    try {
      const response = await fetch('https://sweet-chest.onrender.com/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.telegram?.ok) {
        console.error('❌ Ошибка Telegram:', data);
        throw new Error('Telegram error');
      }

      iziToast.success({
        title: 'Success',
        message: 'Your order has been sent! We’ll call you back soon 💛',
        position: 'topRight',
      });

      form.reset();
      checkbox.checked = false;
    } catch (err) {
      iziToast.error({
        title: 'Error',
        message: 'Failed to send message. Try again later 💔',
        position: 'topRight',
      });
      console.error('Ошибка запроса:', err);
    }
  });
});
