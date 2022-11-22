window.addEventListener("load",function ()  {
  // モーダルを取得
  const modal = document.getElementById("modal");
  // モーダルを表示するボタンを全て取得
  const openModalBtn = document.querySelectorAll(".js-open-modal");
  // モーダルを閉じるボタンを全て取得
  const closeModalBtn = document.querySelectorAll(".js-close-modal");

  // Swiperの設定
  const swiper = new Swiper(".swiper", {
      loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    spaceBetween: 30,
  });

  // モーダルを表示するボタンをクリックしたとき
  openModalBtn.forEach((openModalBtn) => {
    openModalBtn.addEventListener("click", () => {
      // data-slide-indexに設定したスライド番号を取得
      const modalIndex = openModalBtn.dataset.slideIndex;
      swiper.slideTo(modalIndex);
      modal.classList.add("is-active");
    });
  });

  // モーダルを閉じるボタンをクリックしたとき
  closeModalBtn.forEach((closeModalBtn) => {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("is-active");
    });
  });
});