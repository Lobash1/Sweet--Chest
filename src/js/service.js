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
};

// открытие/закрытие
uploadBtn.addEventListener('click', openModal);
overlay.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);

// выбор файла
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      uploadedImage = e.target.result;
      preview.innerHTML = `<img src="${uploadedImage}" alt="Preview" />`;
    };
    reader.readAsDataURL(file);
  }
});

// отправка
form.addEventListener('submit', async e => {
  e.preventDefault();
  const phone = form.elements.phone.value.trim();

  if (!uploadedImage) {
    iziToast.warning({
      title: 'Photo required',
      message: 'Please upload a photo first 📸',
      position: 'topRight',
    });
    return;
  }

  try {
    const response = await fetch('https://sweet-chest.onrender.com/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, image: uploadedImage }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) throw new Error();

    iziToast.success({
      title: 'Success!',
      message: 'Your request has been sent 💛',
      position: 'topRight',
    });
    closeModal();
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to send message. Try again later 💔',
      position: 'topRight',
    });
  }
});
