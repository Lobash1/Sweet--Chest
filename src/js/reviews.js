import Swiper, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/swiper-bundle.css';
import '../css/reviews.css';

Swiper.use([Navigation, Pagination, Autoplay]);

const reviews = [
  {
    id: 1,
    title: 'The result absolutely delighted me — friends were thrilled', // заголовок отзыва
    text: "I ordered cupcakes as a New Year's gift. The process was easy and pleasant, and the result was amazing. Packaging and flavor were perfect. I will definitely reorder!", // текст
    avatar: '/img/reviews/irina.jpg', // путь к картинке-аватару (папка public/img/reviews)
    name: 'Irina Larionova', // имя автора
    city: 'Saint Petersburg', // город (подпись)
  },
  {
    id: 2,
    title: 'Delicious and beautifully decorated!',
    text: 'Ordered for a birthday party. Everyone loved them — beautiful decorations and great taste. Fast delivery and very attentive service.',
    avatar: '/img/reviews/anna.jpg',
    name: 'Anna Demidova',
    city: 'Moscow',
  },
  {
    id: 3,
    title: 'Perfect for gifting — thank you!',
    text: 'I gave cupcakes as a gift and they made a great impression. Packaging was gorgeous, and flavors were delicate and lovely.',
    avatar: '/img/reviews/olga.jpg',
    name: 'Olga Petrov',
    city: 'Kyiv',
  },
];

function renderReviews() {
  const wrapper = document.getElementById('reviews-wrapper');
  if (!wrapper) return;

  const slidesHtml = reviews.map(r => {
    return;
    <div class="swiper-slide">
      <article class="review-card" aria-label="Customer review by ${r.name}">
        <div class="review-quote">
          <div class="mark">“</div>
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
          <div class="name">${r.name}</div>
          <div class="city">${r.city}</div>
        </div>
      </article>
    </div>;
  });
}
