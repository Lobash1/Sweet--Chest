// import iziToast from 'izitoast';

// document.addEventListener('DOMContentLoaded', () => {
//   if (window.botFormHandlerAttached) return;
//   window.botFormHandlerAttached = true;

//   console.log('✅ order.js loaded');

//   const forms = document.querySelectorAll('.bot');
//   console.log('Найдено форм:', forms.length);

//   forms.forEach(form => {
//     form.addEventListener('submit', async e => {
//       e.preventDefault();

//       const phoneInput = form.querySelector('input[name="phone"]');
//       const phone = phoneInput?.value.trim();

//       console.log('📩 Сабмит формы');
//       console.log('📞 Введён номер:', phone);

//       if (!phone) {
//         iziToast.warning({
//           title: 'Enter your phone number',
//           message: 'Please enter your phone number before sending 💛',
//           position: 'topRight',
//         });
//         return;
//       }

//       try {
//         console.log('📦 Отправляем тело запроса:', JSON.stringify({ phone }));

//         const response = await fetch('http://localhost:3000/send', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ phone }),
//         });

//         const data = await response.json();
//         console.log('Ответ от Telegram:', response.status, data);

//         if (!response.ok || !data.success || !data.telegram?.ok) {
//           console.error('❌ Ошибка Telegram:', data);
//           throw new Error('Telegram error');
//         }

//         iziToast.success({
//           title: 'Sent!',
//           message: 'We’ll call you back soon 💛',
//           position: 'topRight',
//         });

//         await new Promise(r => setTimeout(r, 500));
//         form.reset();
//       } catch (err) {
//         iziToast.error({
//           title: 'Error',
//           message: 'Failed to send message. Try again later 💔',
//           position: 'topRight',
//         });
//         console.error('Ошибка запроса:', err);
//       }
//     });
//   });
// });
