function initSwiperAbout() {
  requestAnimationFrame(() => {
    const partnersSwiper = document.querySelector(".partners-swiper");
        
    if (partnersSwiper) {
      new Swiper(".partners-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        },
      });
    }
  });
}
initSwiperAbout();