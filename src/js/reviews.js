import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../css/reviews.css';

import img1 from '../img/reviews/img1.png';
import img2 from '../img/reviews/3camila3.jpg';
import img3 from '../img/reviews/4daniel.jpg';

const reviews = [
  {
    id: 1,
    title: '«The result absolutely delighted me — friends were thrilled»',
    text: '«I ordered cupcakes as a New Years gift. The process was easy and pleasant, and the result was amazing. Packaging and flavor were perfect. I will definitely reorder! I ordered cupcakes as a New Years gift. The process was easy and pleasant, and the result was amazing. Packaging and flavor were perfect. I will definitely reorder!»',
    avatar: img1,
    name: 'Irina Larionova',
    city: 'Saint Petersburg',
  },
  {
    id: 2,
    title: '«Delicious and beautifully decorated!»',
    text: '«Ordered for a birthday party. Everyone loved them — beautiful decorations and great taste. Fast delivery and very attentive service.»',
    avatar: img2,
    name: 'Anna Demidova',
    city: 'Dnipro',
  },
  {
    id: 3,
    title: '«Perfect for gifting — thank you!»',
    text: '«I gave cupcakes as a gift and they made a great impression. Packaging was gorgeous, and flavors were delicate and lovely.»',
    avatar: img3,
    name: 'Oleg Petrov',
    city: 'Kyiv',
  },
];

// 6) Функция, которая создаёт HTML для каждого отзыва и вставляет его в DOM
function renderReviews() {
  const wrapper = document.getElementById('reviews-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = reviews
    .map(r => {
      return `
       <div class="swiper-slide">
      <article class="review-card" aria-label="Customer review by ${r.name}">
        <div class="review-quote">
          <div class="mark"><svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.78049 9.99024C13.6083 9.99024 17.522 13.904 17.522 18.7317C17.522 23.5594 13.6083 27.4732 8.78049 27.4732C3.9527 27.4732 0.0390244 23.5594 0.0390244 18.7317L0 17.4829C0 7.82736 7.82736 0 17.4829 0V4.99512C14.1474 4.99512 11.0114 6.29409 8.65272 8.65272C8.19871 9.10681 7.78435 9.58993 7.41058 10.0974C7.85694 10.0272 8.31438 9.99024 8.78049 9.99024ZM31.2585 9.99024C36.0862 9.99024 40 13.904 40 18.7317C40 23.5594 36.0862 27.4732 31.2585 27.4732C26.4308 27.4732 22.5171 23.5594 22.5171 18.7317L22.478 17.4829C22.478 7.82736 30.3053 0 39.961 0V4.99512C36.6255 4.99512 33.4893 6.29409 31.1308 8.65272C30.6767 9.10681 30.2623 9.58993 29.8885 10.0974C30.3349 10.0272 30.7924 9.99024 31.2585 9.99024Z" fill="#5D6AFB" />
</svg></div>
          <div class="review-text">
            <h3>${r.title}</h3>
            <p>${r.text}</p>
            <a href="#" class="review-link">
              Read full review
            </a>
          </div>
        </div>

        <div class="review-avatar">
          <img src="${r.avatar}" alt="${r.name}" loading="lazy" />
          <div>
          <div class="name">${r.name}</div>
          <div class="city">${r.city}</div>
          </div>



        </div>
      </article>
    </div>
    `;
    })
    .join('');
}

// 7) Функция инициализации Swiper с опциями
function initReviewsSwiper() {
  new Swiper('.reviews-swiper', {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 40,
    speed: 700,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

// =============== Run on DOM ready ===============
// 8) Когда DOM готов (вся разметка загружена), вызываем функции: рендер и инициали
document.addEventListener('DOMContentLoaded', () => {
  renderReviews();
  initReviewsSwiper();
});
