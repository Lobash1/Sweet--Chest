import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('julia-modal');
  const openBtn = document.querySelector('.about-btn');
  const closeBtn = modal?.querySelector('.modal-close');
  const overlay = modal?.querySelector('.modal-overlay');
  const form = document.getElementById('julia-form');

  if (!modal || !openBtn || !closeBtn || !overlay || !form) {
    console.warn('⚠ Julia modal elements missing');
    return;
  }

  const API_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:3000/ask'
    : 'https://sweet-chest.onrender.com/ask';

  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    form.reset();
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const question = form.elements.question.value.trim();
    const phone = form.elements.phone.value.trim();

    if (!question) {
      iziToast.warning({
        title: 'Question required',
        message: 'Please write your question 💬',
        position: 'topRight',
      });
      return;
    }

    if (!phone) {
      iziToast.warning({
        title: 'Phone required',
        message: 'Please enter your phone number ☎',
        position: 'topRight',
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error('Ошибка сервера:', data);
        throw new Error();
      }

      iziToast.success({
        title: 'Sent!',
        message: 'Julia will contact you soon 💛',
        position: 'topRight',
      });

      closeModal();
    } catch (err) {
      iziToast.error({
        title: 'Error',
        message: 'Failed to send question. Try again later 💔',
        position: 'topRight',
      });
      console.error('ASK error:', err);
    }
  });
});
