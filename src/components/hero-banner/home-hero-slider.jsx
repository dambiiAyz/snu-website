'use client';
// external
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
// internal
import slider_img_1 from "@assets/img/slider/slider-img-1.png";
import slider_img_2 from "@assets/img/slider/slider-img-2.png";
import slider_img_3 from "@assets/img/slider/slider-img-3.png";
import shape_1 from "@assets/img/slider/shape/slider-shape-1.png";
import shape_2 from "@assets/img/slider/shape/slider-shape-2.png";
import shape_3 from "@assets/img/slider/shape/slider-shape-3.png";
import shape_4 from "@assets/img/slider/shape/slider-shape-4.png";
import { ArrowRightLong, SliderNextBtn, SliderPrevBtn, TextShape } from "@/svg";
import { formatCurrency } from "@/utils/format-currency";

// slider data
const sliderData = [
  {
    id: 1,
    pre_title: { textKey: "home.slider.preTitle", price: 274 },
    titleKey: "home.slider.title1",
    subtitle: {
      text_1_key: "home.slider.subtitleText1",
      percent: 35,
      text_2_key: "home.slider.subtitleText2",
    },
    img: slider_img_1,
    green_bg: true,
  },
  {
    id: 2,
    pre_title: { textKey: "home.slider.preTitle", price: 999 },
    titleKey: "home.slider.title2",
    subtitle: {
      text_1_key: "home.slider.subtitleText1",
      percent: 10,
      text_2_key: "home.slider.subtitleText2",
    },
    img: slider_img_2,
    green_bg: true,
  },
  {
    id: 3,
    pre_title: { textKey: "home.slider.preTitle", price: 999 },
    titleKey: "home.slider.title3",
    subtitle: {
      text_1_key: "home.slider.subtitleText1",
      percent: 10,
      text_2_key: "home.slider.subtitleText2",
    },
    img: slider_img_3,
    is_light: true,
  },
];

function Shape({ img, num }) {
  return (
    <Image className={`tp-slider-shape-${num}`} src={img} alt="slider-shape" priority />
  );
}

const HomeHeroSlider = ({ covers = null }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, i18n } = useTranslation("common");
  const slides = covers === null
    ? sliderData.map((item) => ({
        id: item.id, img: item.img, light: Boolean(item.is_light),
        title: t(item.titleKey), eyebrow: t(item.pre_title.textKey),
        price: item.pre_title.price, offer: t(item.subtitle.text_1_key),
        highlight: `-${item.subtitle.percent}%`, suffix: t(item.subtitle.text_2_key),
        button: t("home.slider.shopNow"), href: "/shop",
      }))
    : covers.flatMap((cover) => {
        const mn = cover?.text?.mn;
        if (!mn?.title || !/^https:\/\/res\.cloudinary\.com\//.test(cover.imageUrl)) return [];
        const localized = cover.text[i18n.resolvedLanguage] || {};
        const field = (key) => localized[key] || mn[key];
        return [{
          id: cover._id, img: cover.imageUrl, light: cover.theme === "light",
          title: field("title"), eyebrow: field("eyebrow"), price: cover.startPrice,
          offer: field("offer"), highlight: field("highlight"), suffix: field("suffix"),
          alt: field("alt"), button: field("button"), href: cover.href,
        }];
      });
  if (!slides.length) return null;
  const active = slides[activeIndex]?.light;
  return (
    <>
      <section className="tp-slider-area p-relative z-index-1">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={false}
          effect="fade"
          navigation={{
            nextEl: ".tp-slider-button-next",
            prevEl: ".tp-slider-button-prev",
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          pagination={{ el: ".tp-slider-dot", clickable: true }}
          modules={[Navigation, Pagination, EffectFade]}
          className={`tp-slider-active tp-slider-variation swiper-container ${
            active ? "is-light" : ""
          }`}
        >
          {slides.map((item) => (
            <SwiperSlide
              key={item.id}
              className={`tp-slider-item tp-slider-height d-flex align-items-center ${
                item.light ? "is-light" : "green-dark-bg"
              }`}
              style={{ backgroundColor: item.light ? "#E3EDF6" : undefined }}
            >
              <div className="tp-slider-shape">
                <Shape img={shape_1} num="1" />
                <Shape img={shape_2} num="2" />
                <Shape img={shape_3} num="3" />
                <Shape img={shape_4} num="4" />
              </div>
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-xl-5 col-lg-6 col-md-6">
                    <div className="tp-slider-content p-relative z-index-1">
                      {(item.eyebrow || item.price != null) && <span>
                        {item.eyebrow} {item.price != null && <b>{formatCurrency(item.price, 0)}</b>}
                      </span>}
                      <h3 className="tp-slider-title">{item.title}</h3>
                      {(item.offer || item.highlight || item.suffix) && <p>
                        {item.offer} {item.highlight && <span>{item.highlight}<TextShape /></span>} {item.suffix}
                      </p>}
                      {item.button && /^\/(?!\/)/.test(item.href) && !/[\\\s]/.test(item.href) && (
                        <div className="tp-slider-btn">
                          <Link href={item.href} className="tp-btn tp-btn-2 tp-btn-white">
                            {item.button} <ArrowRightLong />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-6 col-md-6">
                    <div className="tp-slider-thumb text-end">
                      <Image src={item.img} alt={item.alt || item.title}
                        width={item.img.width || 738} height={item.img.height || 391}
                        style={{ maxWidth: "100%", height: "auto", maxHeight: 391, objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="tp-slider-arrow tp-swiper-arrow">
            <button type="button" className="tp-slider-button-prev">
              <SliderPrevBtn />
            </button>
            <button type="button" className="tp-slider-button-next">
              <SliderNextBtn />
            </button>
          </div>
          <div className="tp-slider-dot tp-swiper-dot"></div>
        </Swiper>
      </section>
    </>
  );
};

export default HomeHeroSlider;
