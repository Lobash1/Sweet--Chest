import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const orderButtons = document.querySelectorAll('.catalog .btn');
const modal = document.getElementById('order-modal');
const closeBtn = modal.querySelector('.modal-close');
const overlay = modal.querySelector('.modal-overlay');
const productName = document.getElementById('modal-product-name');
let currentProduct = '';
let currentImage = ''; // 🖼️ добавим переменную для картинки

document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  // === открыть модалку ===
  orderButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      const block = e.target.closest('.block');
      const product = block.querySelector('.name').textContent.trim();
      const img = e.target.closest('.item').querySelector('img').src; // 🖼️ ссылка на фото

      currentProduct = product;
      currentImage = img;
      productName.textContent = `(${product})`;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // === закрыть модалку ===
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // === отправка формы ===
  document.getElementById('modal-form').addEventListener('submit', async e => {
    e.preventDefault();
    const phone = e.target.elements.phone.value.trim();

    if (!phone) {
      iziToast.error({
        title: 'Error',
        message: 'Please enter your phone number',
        position: 'topRight',
      });
      return;
    }

    try {
      const response = await fetch('https://sweet-chest.onrender.com/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          product: currentProduct,
          image: currentImage, // 🖼️ теперь передаем и ссылку
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) throw new Error();

      iziToast.success({
        title: 'Thank you!',
        message: `Your order for "${currentProduct}" has been sent 💛`,
        position: 'topRight',
      });

      e.target.reset();
      closeModal();
    } catch (err) {
      console.error('Ошибка отправки:', err);
      iziToast.error({
        title: 'Error',
        message: 'Failed to send message. Try again later 💔',
        position: 'topRight',
      });
    }
  });
});
