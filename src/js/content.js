import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const orderButtons = document.querySelectorAll('.catalog .btn');
const modal = document.getElementById('order-modal');
const closeBtn = modal.querySelector('.modal-close');
const overlay = modal.querySelector('.modal-overlay');
const productName = document.getElementById('modal-product-name');

document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  orderButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      const product = e.target
        .closest('.block')
        .querySelector('.name').textContent;
      productName.textContent = `(${product})`;
      modal.classList.add('open');
    });
  });

  const closeModal = () => modal.classList.remove('open');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.getElementById('modal-form').addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.elements.phone.value.trim();

    if (input === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter your phone number',
        position: 'topRight',
      });
      return;
    }

    iziToast.success({
      title: 'Thank you!',
      message: 'We’ll contact you soon 💛',
      position: 'topRight',
    });
    e.target.reset();
    closeModal();
  });
});
