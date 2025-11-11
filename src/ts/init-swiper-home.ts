import Swiper from "swiper";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/autoplay";
// @ts-ignore
import "swiper/css/navigation";
import { Navigation,Autoplay } from "swiper/modules";

/**
 * Initialize Swipers used on the Home page
 */
export function initSwiperHome(): void {
  requestAnimationFrame(() => {
    // Vertical section swiper
    const swiperElement = document.querySelector(".mySwiper");
    if (swiperElement) {
      const swiper = new Swiper(".mySwiper", {
        modules: [Navigation, Autoplay],
        slidesPerView: 1,
        loop:true,
        updateOnWindowResize:true,
        autoplay:{
          pauseOnMouseEnter:true,
          delay:5000
        },
        breakpoints:{
          1024:{
            direction: "vertical",
            slidesPerView: 3,
            spaceBetween: 150,
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
