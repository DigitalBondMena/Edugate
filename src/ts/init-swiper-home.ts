import Swiper from "swiper";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/autoplay";
// @ts-ignore
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

/**
 * Initialize Swipers used on the Home page
 */
export function initSwiperHome(): void {
  requestAnimationFrame(() => {
    // Vertical section swiper
    const swiperElement = document.querySelector(".mySwiper");
    if (swiperElement) {
      const swiper = new Swiper(".mySwiper", {
        direction: "vertical",
        slidesPerView: 3,
        spaceBetween: 10,
        observer: true,
        observeParents: true,
        updateOnWindowResize: true,
        watchSlidesProgress: true,
      });

      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const prevBtnLg = document.getElementById("prevBtnLg");
      const nextBtnLg = document.getElementById("nextBtnLg");
      const isRtl = document.documentElement.dir === "rtl";

      if (prevBtn && nextBtn) {
        if (isRtl) {
          prevBtn.addEventListener("click", () => swiper.slideNext());
          nextBtn.addEventListener("click", () => swiper.slidePrev());
        } else {
          prevBtn.addEventListener("click", () => swiper.slidePrev());
          nextBtn.addEventListener("click", () => swiper.slideNext());
        }
      }

      if (prevBtnLg && nextBtnLg) {
        prevBtnLg.addEventListener("click", () => swiper.slidePrev());
        nextBtnLg.addEventListener("click", () => swiper.slideNext());
      }
    }

    // Testimonials swiper
    const testimonialsElement = document.querySelector(".testimonials-swiper");
    if (testimonialsElement) {
      new Swiper(".testimonials-swiper", {
        modules: [Navigation],
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
