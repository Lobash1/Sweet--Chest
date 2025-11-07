document.addEventListener('DOMContentLoaded', () => {
  const text = `Cakes and cupcakes from 65 UAH per piece
with delivery to the Kamianske region.
Freshly baked and packed with care.`;

  const title = document.getElementById('typewriter');

  let i = 0;
  function type() {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(type, 40); // швидкість набору
    }
  }

  type();
});
