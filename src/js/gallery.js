document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loader');
  const galleryImages = document.querySelectorAll('.gallery-img');
  const modal = document.getElementById('gallery-modal');
  const modalImg = modal.querySelector('.gallery-modal-img');
  const btnClose = modal.querySelector('.gallery-modal-close');
  const btnPrev = modal.querySelector('.gallery-modal-prev');
  const btnNext = modal.querySelector('.gallery-modal-next');

  let currentIndex = 0;

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      openModal(img.src);
    });
  });

  function openModal(src) {
    modalImg.src = src;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  btnClose.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target.classList.contains('gallery-modal-overlay')) {
      closeModal();
    }
  });

  function showPrev() {
    currentIndex =
      (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    modalImg.src = galleryImages[currentIndex].src;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    modalImg.src = galleryImages[currentIndex].src;
  }

  btnPrev.addEventListener('click', showPrev);
  btnNext.addEventListener('click', showNext);

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('show')) return;

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
});
