import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const uploadBtn = document.querySelector('.service-btn');
const modal = document.getElementById('upload-modal');
const overlay = modal.querySelector('.modal-overlay');
const closeBtn = modal.querySelector('.modal-close');
const fileInput = modal.querySelector('.file-input');
const preview = document.getElementById('photo-preview');
const form = document.getElementById('upload-form');

let uploadedImage = null;
let isSending = false;

const API_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:3000/upload'
  : 'https://sweet-chest.onrender.com/upload';

const openModal = () => {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  preview.innerHTML = '<p class="preview-placeholder">No photo selected</p>';
  uploadedImage = null;
  form.reset();
  isSending = false;
};

uploadBtn?.addEventListener('click', openModal);
overlay?.addEventListener('click', closeModal);
closeBtn?.addEventListener('click', closeModal);

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    uploadedImage = e.target.result;
    preview.innerHTML = `<img src="${uploadedImage}" class="preview-img" alt="Preview" />`;
  };
  reader.readAsDataURL(file);
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  if (isSending) return;
  isSending = true;

  const phone = form.elements.phone.value.trim();
  const phoneRegex = /^\+?\d[\d\s\-\(\)]{8,}$/;

  if (!uploadedImage) {
    iziToast.warning({
      title: 'Photo required',
      message: 'Please upload a photo first 📸',
      position: 'topRight',
    });
    isSending = false;
    return;
  }

  if (!phone || !phoneRegex.test(phone)) {
    iziToast.warning({
      title: 'Invalid number',
      message: 'Enter a valid phone number ☎',
      position: 'topRight',
    });
    isSending = false;
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, image: uploadedImage }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) throw new Error('Send error');

    iziToast.success({
      title: 'Success!',
      message: 'Your request has been sent 💛',
      position: 'topRight',
    });

    closeModal();
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to send. Try again later 💔',
      position: 'topRight',
    });
    console.error('UPLOAD error:', err);
    isSending = false;
  }
});
