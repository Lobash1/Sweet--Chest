import{S as o,N as l,P as d,A as c}from"./assets/vendor-wLd89c5_.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(e){if(e.ep)return;e.ep=!0;const a=n(e);fetch(e.href,a)}})();const v="/Sweet--Chest/assets/img1-DmrWSVBm.png",u="/Sweet--Chest/assets/3camila3-rqIcvNgS.jpg",p="/Sweet--Chest/assets/4daniel-DP65KA9i.jpg",f=[{id:1,title:"«The result absolutely delighted me — friends were thrilled»",text:"«I ordered cupcakes as a New Years gift. The process was easy and pleasant, and the result was amazing. Packaging and flavor were perfect. I will definitely reorder! I ordered cupcakes as a New Years gift. The process was easy and pleasant, and the result was amazing. Packaging and flavor were perfect. I will definitely reorder!»",avatar:v,name:"Irina Larionova",city:"Saint Petersburg"},{id:2,title:"«Delicious and beautifully decorated!»",text:"«Ordered for a birthday party. Everyone loved them — beautiful decorations and great taste. Fast delivery and very attentive service.»",avatar:u,name:"Anna Demidova",city:"Dnipro"},{id:3,title:"«Perfect for gifting — thank you!»",text:"«I gave cupcakes as a gift and they made a great impression. Packaging was gorgeous, and flavors were delicate and lovely.»",avatar:p,name:"Oleg Petrov",city:"Kyiv"}];function g(){const i=document.getElementById("reviews-wrapper");i&&(i.innerHTML=f.map(t=>`
       <div class="swiper-slide">
      <article class="review-card" aria-label="Customer review by ${t.name}">
        <div class="review-quote">
          <div class="mark"><svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.78049 9.99024C13.6083 9.99024 17.522 13.904 17.522 18.7317C17.522 23.5594 13.6083 27.4732 8.78049 27.4732C3.9527 27.4732 0.0390244 23.5594 0.0390244 18.7317L0 17.4829C0 7.82736 7.82736 0 17.4829 0V4.99512C14.1474 4.99512 11.0114 6.29409 8.65272 8.65272C8.19871 9.10681 7.78435 9.58993 7.41058 10.0974C7.85694 10.0272 8.31438 9.99024 8.78049 9.99024ZM31.2585 9.99024C36.0862 9.99024 40 13.904 40 18.7317C40 23.5594 36.0862 27.4732 31.2585 27.4732C26.4308 27.4732 22.5171 23.5594 22.5171 18.7317L22.478 17.4829C22.478 7.82736 30.3053 0 39.961 0V4.99512C36.6255 4.99512 33.4893 6.29409 31.1308 8.65272C30.6767 9.10681 30.2623 9.58993 29.8885 10.0974C30.3349 10.0272 30.7924 9.99024 31.2585 9.99024Z" fill="#5D6AFB" />
</svg></div>
          <div class="review-text">
            <h3>${t.title}</h3>
            <p>${t.text}</p>
            <a href="#" class="review-link">
              Read full review
            </a>
          </div>
        </div>

        <div class="review-avatar">
          <img src="${t.avatar}" alt="${t.name}" loading="lazy" />
          <div>
          <div class="name">${t.name}</div>
          <div class="city">${t.city}</div>
          </div>



        </div>
      </article>
    </div>
    `).join(""))}function w(){new o(".reviews-swiper",{modules:[l,d,c],loop:!0,slidesPerView:1,centeredSlides:!0,spaceBetween:40,speed:700,autoplay:{delay:6e3,disableOnInteraction:!1},pagination:{el:".swiper-pagination",clickable:!0},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}})}document.addEventListener("DOMContentLoaded",()=>{g(),w()});
//# sourceMappingURL=index.js.map
