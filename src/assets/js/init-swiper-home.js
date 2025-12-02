function initSwiperHome() {
  requestAnimationFrame(() => {
    const swiperElement = document.querySelector(".mySwiper");
    if (swiperElement) {
      const swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        autoHeight: false,
        loop:true,
        updateOnWindowResize:true,
        observer: true,
  observeParents: true,
        // autoplay:{
        //   pauseOnMouseEnter:true,
        //   delay:5000
        // },
        breakpoints:{
          1024:{
            direction: "vertical",
            slidesPerView: 3,
            spaceBetween: 10,
          }
        }
      });
      const prevBtnLg = document.getElementById("prevBtnLg");
      const nextBtnLg = document.getElementById("nextBtnLg");

      if (prevBtnLg && nextBtnLg) {
        prevBtnLg.addEventListener("click", () => swiper.slidePrev());
        nextBtnLg.addEventListener("click", () => swiper.slideNext());
      }
    }

    // Testimonials swiper
    const testimonialsElement = document.querySelector(".testimonials-swiper");
    if (testimonialsElement) {
      new Swiper(".testimonials-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: "#testimonial-next",
          prevEl: "#testimonial-prev",
        },
      });
    }
  });
}
initSwiperHome()