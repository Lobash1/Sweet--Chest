import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('julia-modal');
  const openBtn = document.querySelector('.about-btn');
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  const form = document.getElementById('julia-form');

  // открыть
  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
  });

  // закрыть
  const closeModal = () => modal.classList.remove('open');
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // отправка
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const question = form.elements.question.value.trim();
    const phone = form.elements.phone.value.trim();

    if (!question || !phone) {
      iziToast.error({
        title: 'Error',
        message: 'Please fill out all fields',
        position: 'topRight',
      });
      return;
    }

    try {
      const response = await fetch('https://sweet-chest.onrender.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, phone }),
      });

      const data = await response.json();
      if (data.success) {
        iziToast.success({
          title: 'Thank you!',
          message: 'Julia will contact you soon 💛',
          position: 'topRight',
        });
        form.reset();
        closeModal();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Telegram error:', err);
      iziToast.error({
        title: 'Error',
        message: 'Failed to send question. Try again later 💔',
        position: 'topRight',
      });
    }
  });
});
