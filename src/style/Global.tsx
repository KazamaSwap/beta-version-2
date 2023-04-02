import { createGlobalStyle } from 'styled-components'
import { KazamaTheme } from '@kazamaswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends KazamaTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: scroll; 
    img {
      height: auto;
      max-width: 100%;
      gif {
        width: 97%;
        border-radius: 10px;
      }
    }
  }

body::-webkit-scrollbar {
    display: none;
}

  .swiper {
    width: 51.5rem;
    height: 100%;
  }

  .senshi-swiper {
    width: 100%;
    height: 100%;
  }
  
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  
  .top-side-bar img {
    display: block;
    width: 100%;
    height: calc(100% - 2px);
    border-radius: 10px;
    object-fit: cover;
    background: radial-gradient(50% 100% at 50% 0,rgba(200,53,78,.12) 0,rgba(200,53,78,0) 100%);
  }

  .swiper-pagination {
    margin-top: 10px;
    margin-bottom: 15px;
  }

  .img-slider-box .swiper-pagination-bullet {
    background: #201c29;
    width: 14px;
    height: 14px;
  }

  .show-gif {
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .gif-preview {
    height: 150px;
    object-fit: contain;
  }

  .top-side-bar .swiper-pagination-bullet {
    border: 2px solid #1d1c22;
    height: 1rem;
    width: 1rem;
    background: #201c29;
    margin: 0 0.5rem;
    cursor: pointer;
    border-radius: 8px;
    position: relative;
  }

  .tv-lightweight-charts {
    height: 100% !important;
  }

  .top-side-bar .swiper-pagination-bullet::after {
    background: #201c29;
    border-radius: 6px;
    content: "";
    height: 0.5rem;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 0.5rem;
  }

  .top-side-bar .swiper-pagination-bullet-active {
    background: #EE1A78;
  }

  .top-side-bar .swiper-button-prev::after, .top-side-bar .swiper-button-next::after {
    font-size: 1.1875em;
    color: #FFFFFF;
  }

  .top-side-bar {
    border-radius: 4px;   
  }

  .swiper-pagination-bullet {
    opacity: 1;
}

  .swiper-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet, .swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
    margin: 0 8px;
}

  .top-side-bar .swiper-button-prev, .top-side-bar .swiper-button-next {
    background: #2e293a;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 6px;
    transition: background-color .15s ease-out;
    padding-bottom: 2px;
    padding-left: 4px;
    top: 50%;
  }

  .top-side-bar {
    max-width: 920px;
    border-radius: 10px;
    height: 385px;
  }

  .slider-graphic {
    animation-fill-mode: forwards;
    background-size: contain!important;
    position: absolute;
    z-index: 6;
  }
  .slider-graphic-1 {
    animation: delay 0.79s;
    background: url('/images/Senshi-NFT.png') no-repeat 50%;
    height: 23.5625rem;
    left: 0rem;
    top: 0;
    transform: scale(1);
    width: 15.125rem;
    margin-left: 15px;
    transition: transform 0.25s;
    -webkit-filter: drop-shadow(50px 50px 50px 50px rgba(46, 43, 58, 0.938));
  }
  .slider-graphic-1:hover {
    transform: scale(1.04);
    transition: transform 0.25s;
}

.slider-graphic-farm-1 {
  animation: delay 0.79s;
  background: url('/images/Senshi-Farmer-NFT.png') no-repeat 50%;
  height: 23.5625rem;
  left: 0rem;
  top: 0;
  transform: scale(1);
  width: 15.125rem;
  margin-left: 15px;
  transition: transform 0.25s;
  -webkit-filter: drop-shadow(50px 50px 50px 50px rgba(46, 43, 58, 0.938));
}
.slider-graphic-farm-1:hover {
  transform: scale(1.04);
  transition: transform 0.25s;
}

  .slider-graphic-2 {
    animation: delay 6s;
    background: url('/images/KazamaTokenV2.png') no-repeat 50%;
    height: 8.5625rem;
    left: 0rem;
    bottom: 0;
    transform: scale(1);
    width: 30.125rem;
    -webkit-filter: drop-shadow(12px 12px 7px rgba(46, 43, 58, 0.788));
  }
  .slider-graphic-3 {
    animation: delay 0.99s;
    background: url('/images/Senshi-NFT-Right.png') no-repeat 50%;
    height: 23.5625rem;
    right: 0rem;
    top: 0;
    transform: scale(1);
    width: 15.125rem;
    margin-right: 15px;
    transition: transform 0.25s;
    -webkit-filter: drop-shadow(50px 50px 50px 50px rgba(46, 43, 58, 0.938));
  }
  .slider-graphic-3:hover {
    transform: scale(1.04);
    transition: transform 0.25s;
}

  .slider-graphic-4 {
    animation: fadein-data-v-ccdbb6a2 .3s ease-in-out 3.5s;
    background: url('/images/home/KazamaToken/KazamaRight.png') no-repeat 50%;
    height: 10.5625rem;
    right: 0rem;
    bottom: 0;
    transform: scale(1);
    width: 10.125rem;
    -webkit-filter: drop-shadow(12px 12px 7px rgba(46, 43, 58, 0.788));
  }


  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes scale {
    0% {
      transform: scale(0)
    }
    100% {
      transform: scale(1)
    }
  }
  @keyframes delay {
    0% {
      transform: scale(0)
    }
    50% {
      transform: scale(0)
    }
    100% {
      transform: scale(1)
    }
  }

  .timer-info {
    display: grid;
    -moz-column-gap: .5rem;
    column-gap: 0.5rem;
    grid-auto-flow: column;
    font-family: Inter;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 2.5rem;
  }

  .timer-topbar-info {
    display: grid;
    -moz-column-gap: .5rem;
    column-gap: 0.1rem;
    grid-auto-flow: column;

    align-items: center;
    padding-right: 5px;
  }

  .timer-info-col {
    display: grid;
    grid-auto-flow: column;
    -moz-column-gap: .25rem;
    column-gap: 0.25rem;
    position: relative;
  }

  .timer-info-col .value {
    border-radius: 5px;
    width: 2.5rem;
    color: #fff;
    text-align: center;
    position: relative;
    background: #EE1A78;
    background-size: cover;
    background-position: 50%;
  }

  .timer-info-col .label {
    position: absolute;
    width: 100%;
    bottom: -2.25rem;
    font-size: .85rem;
    font-weight: 500;
    color: #f0f0f0;
    opacity: .85;
    text-align: center;
  }




  .timer-info {
    display: grid;
    -moz-column-gap: .5rem;
    column-gap: 0.5rem;
    grid-auto-flow: column;
    font-family: Inter;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 2.5rem;
  }

  .timer-topbar-info {
    display: grid;
    -moz-column-gap: .5rem;
    column-gap: 0.1rem;
    grid-auto-flow: column;

    align-items: center;
    padding-right: 5px;
  }

  .timer-distribution-col {
    display: grid;
    grid-auto-flow: column;
    -moz-column-gap: .25rem;
    column-gap: 0.25rem;
    position: relative;
  }

  .timer-distribution-col .value {
    border-radius: 5px;
    width: 2.5rem;
    color: #fff;
    text-align: center;
    position: relative;

    background-size: cover;
    background-position: 50%;
  }

  .timer-distribution-col .label {
    position: absolute;
    width: 100%;
    bottom: -2.25rem;
    font-size: .85rem;
    font-weight: 500;
    color: #F4EEFF;
    opacity: .85;
    text-align: center;
  }




  .raffle-unit {
    // background: #242329;
  }

  .raffle-hero-unit {
    text-align: center;
    // background-color: #241f2e;
    position: relative;
  }

  .timer-shadow {
    background: linear-gradient(89.92deg, rgb(238, 26, 121) 50%, rgb(247, 147, 24) 50%);
    opacity: 0.35;
    filter: blur(50px);
    border-radius: 190.145px;
    width: 300px;
    height: 317px;
    position: absolute;
    top: -90px;
    left: 0;
    margin-left: 50px;
  }

  .timer-shadow-right {
    background: linear-gradient(89.92deg, rgb(238, 26, 121) 50%, rgb(247, 147, 24) 50%);
    opacity: 0.35;
    filter: blur(50px);
    border-radius: 190.145px;
    width: 300px;
    height: 317px;
    position: absolute;
    top: -132px;
    right: 0;
    margin-right: 50px;
  }


  .raffle-hero-unit .inner {
    // background: rgba(36,35,41,.92);

    width: 100%;
    height: 100%;

    overflow: hidden;
    display: inline-grid;
    justify-content: center;
  }

  .raffle-hero-unit .inner .big-text {
    font-family: Rubik;
    font-weight: 900;
    text-transform: uppercase;
    color: #fe617c;
    font-size: 5rem;
    line-height: 5.25rem;
  }
  .raffle-hero-unit .inner .medium-text {
    font-family: Rubik;
    font-weight: 900;
    text-transform: uppercase;
    color: #fff;
    font-size: 2.4rem;
    line-height: 2.75rem;
  }
  .raffle-hero-unit .inner .small-text {
    max-width: 35rem;
    color: #f0f0f0;
    font-size: 14px;
    font-weight: 400;
    margin-top: 1rem;
  }
  .raffle-hero-unit .left-graphics {
    position: absolute;
    left: 0;
    width: 24rem;
    height: 24rem;
    margin-left: 0px;
    bottom: -160px;
  }
  .raffle-hero-unit .right-graphics {
    position: absolute;
    right: 0;
    width: 24rem;
    height: 24rem;
    margin-left: 0px;
    bottom: -160px;
  }
  .raffle-hero-unit .left-graphics .tree {
    background: url('/images/Kazama_Lottery.png') no-repeat;
    background-size: contain;
    width: 100%;
    height: 100%;
  }
  .raffle-hero-unit .left-graphics .snow {
    background: url('/images/snow.svg') no-repeat;
    background-size: contain;
    background-position: 0 100%;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: -2rem;
  }
  .raffle-hero-unit .left-graphics .tree:before {
    content: "";
    position: absolute;
    left: 0;
    background: url('/images/tree_blur.svg') no-repeat;
    background-size: contain;
    background-position: 0 100%;
    width: 100%;
    height: 100%;
  }
  .raffle-hero-unit .right-graphics .gifts {
    background: url('/images/Kazama_Lottery.png') no-repeat;
    background-size: contain;
    width: 100%;
    height: 100%;
  }
  .raffle-hero-unit .right-graphics .gifts:before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    background: url('/images/gifts_blur.svg') no-repeat;
    background-size: contain;
    background-position: 100% 100%;
    width: 100%;
    height: 100%;
  }
  .raffle-hero-unit .right-graphics .snow {
    background: url('/images/snow.svg') no-repeat;
    background-size: contain;
    background-position: 100% 100%;
    transform: scaleX(-1);
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: -2rem;
  }
  .raffle-countdown {
    width: 100%;
    display: grid;
    justify-content: center;
    text-align: center;
    padding-bottom: 1.25rem;
    margin: 1rem 0;
  }

  .topbar-timer-main {
    width: 100%;
    display: grid;
    justify-content: center;
    text-align: center;
    margin: 1rem 0;
  }

  @media (max-width: 1215px) {
    .raffle-hero-unit .inner .small-text {
      max-width: 30rem;
    }
    .raffle-hero-unit .left-graphics {
      width: 12.5rem;
      height: 8.25rem;
    }
    .raffle-hero-unit .right-graphics {
      width: 12.5rem;
      height: 8.25rem;
    }
    .raffle-hero-unit .left-graphics .snow {
      bottom: -1.25rem;
    }
    .raffle-hero-unit .right-graphics .snow {
      bottom: -1.25rem;
    }
  }
  @media (max-width: 1023px) {
    .raffle-hero-unit .inner .small-text {
      max-width: 25rem;
      font-size: .9rem;
    }
    
    .raffle-hero-unit .left-graphics {
      width: 10em;
      height: 6.66rem;
    }
    .raffle-hero-unit .right-graphics {
      width: 10em;
      height: 6.66rem;
    }
  }
  @media (max-width: 767px) {
    .raffle-hero-unit .inner .big-text {
      font-size: 2rem;
      line-height: 2rem;
      margin-bottom: 1rem;
    }
    .raffle-hero-unit .inner .medium-text {
      font-size: 2rem;
      line-height: 2rem;
      margin-bottom: 1rem;
    }
    .raffle-hero-unit .inner .small-text {
      margin: 1rem auto 0;
      max-width: 80%;
      text-shadow: none;
      font-size: .9rem;
    }
    .raffle-hero-unit .left-graphics {
      width: 7.5rem;
      height: 4.95rem;
    }
    .raffle-hero-unit .right-graphics {
      width: 7.5rem;
      height: 4.95rem;
    }
    .raffle-hero-unit .left-graphics .snow {
      bottom: -1rem;
    }
    .raffle-hero-unit .right-graphics .snow {
      bottom: -1rem;
    }
  }

  @media (max-width: 479px) {
    .raffle-hero-unit .inner .small-text {
      margin: 1rem auto 1.25rem;
      max-width: 70%;
    }
  }

  .userIconContainer {
    display: flex;
    align-items: center;
    justify-content: center
  }

  .styledUserIcon {
    flex-basis: 40%
  }

  ::placeholder {
    color: #fff;
    font-size: 15px;
  }

  input:focus
{
    outline-offset: 0px;
    outline: none;
}

.EmojiPickerReact {
  overflow: hidden;
}

.chat-messages {
  -webkit-mask-image: linear-gradient(to top, rgb(32, 28, 41) 87%, transparent 100%);
  mask-image: linear-gradient(to top, rgb(32, 28, 41) 87%, transparent 100%);
  padding-bottom: 15px;
}

.rankIcon {
  position: absolute;
  right: 0;
}

.page-id-6 .edgtf-page-header .edgtf-menu-area {
  height: 120px !important;
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 35%);
}

.edgtf-header-divided .edgtf-page-header .edgtf-menu-area {
  opacity: 0;
}
.edgtf-menu-area-border-disable .edgtf-page-header .edgtf-menu-area {
  border: none;
}
.edgtf-page-header .edgtf-menu-area {
  position: relative;
  height: 90px;
  background-color: #17161a;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.edgtf-header-divided .edgtf-page-header .edgtf-vertical-align-containers .edgtf-position-left {
  text-align: right;
}

.edgtf-vertical-align-containers .edgtf-position-left {
  position: relative;
  float: left;
  z-index: 2;
  height: 100%;
}

.GifPickerReact {
  --gpr-bg-color: #141824 !important;
  --gpr-picker-border-color: #0D131C !important;
  margin-bottom: 10px;
  padding-bottom: 15px;
  height: 320px;
  --gpr-search-input-placeholder-color: #fff !important;
  --gpr-category-border-color-hover: none !important;
}

.GifPickerReact .gpr-search-container .gpr-icn-search {

}


.GifPickerReact .gpr-search-container input.gpr-search {
  background-color: #111923 !important;
  border: 1px solid #111923 !important;
  border-radius: var(--gpr-search-input-border-radius);
  color: #fff !important;
  font-size: 15px;
  height: var(--gpr-search-input-height);
  outline: none;
  padding: var(--gpr-search-input-padding);
  transition: all .2s ease-in-out;
  width: 100%;
}

.GifPickerReact .gpr-header {
  border-bottom: 0px solid var(--gpr-picker-border-color) !important;
  min-height: 0;
  padding: 10px !important;
}

.GifPickerReact .gpr-category-list {
  grid-gap: var(--gpr-category-list-padding);
  display: grid;
  flex: 1;
  grid-auto-rows: min-content;
  grid-template-columns: 1fr 1fr;
  overflow-y: scroll;
  padding: 10px !important;
}

.GifPickerReact .gpr-category img {
  background-color: transparent !important;
  border-radius: 10px !important;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
}

.GifPickerReact .gpr-category-overlay {
  align-items: center;
  background-color: rgba(0,0,0,var(--gpr-category-background-opacity));
  border-radius: 10px !important;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color .15s ease-in-out;
  width: 100%;
}

.EmojiPickerReact {
  background-color: #141824 !important;
  overflow: hidden;
}

aside.EmojiPickerReact.epr-main {
  border-color: #0D131C !important;
  border-radius: 10px !important;
  border-style: solid;
  border-width: 1px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 15px !important;
  font-family: 'Kanit', sans-serif !important;
}

.EmojiPickerReact li.epr-emoji-category>.epr-emoji-category-label {
  align-items: center;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  background-color: #1b2031 !important;
  color: #fff !important;
  font-weight: 500 !important;
  display: flex;
  font-family: 'Kanit', sans-serif !important;
  font-size: 15px !important;
  height: var(--epr-category-label-height);
  padding: var(--epr-category-label-padding);
  position: -webkit-sticky;
  position: sticky;
  text-transform: capitalize;
  top: 0;
  width: 100%;
  z-index: var(--epr-category-label-z-index);
}

.EmojiPickerReact .epr-preview {
  display: none !important;
}

.EmojiPickerReact .epr-search-container input.epr-search {
  background-color: #111923 !important;
  border: 1px solid #111923 !important;
  border-radius: var(--epr-search-input-border-radius);
  color: var(--epr-search-input-text-color);
  height: var(--epr-search-input-height);
  outline: none;
  padding: var(--epr-search-input-padding);
  transition: all .2s ease-in-out;
  width: 100%;
  font-family: 'Kanit', sans-serif !important;
  color: #fff !important;
  font-size: 15px !important;
}

.EmojiPickerReact {
  --epr-highlight-color: #007aeb;
  --epr-hover-bg-color: #f1f8ff;
  --epr-focus-bg-color: #1c2532 !important;
  --epr-text-color: #fff !important;
  --epr-search-input-bg-color: #f6f6f6;
  --epr-picker-border-color: #e7e7e7;
  --epr-bg-color: #fff;
  --epr-category-icon-active-color: #fff !important;
  --epr-skin-tone-picker-menu-color: #ffffff95;
  --epr-horizontal-padding: 10px;
  --epr-picker-border-radius: 8px;
  --epr-search-border-color: var(--epr-highlight-color);
  --epr-header-padding: 15px var(--epr-horizontal-padding);
  --epr-active-skin-tone-indicator-border-color: #fff !important;
  --epr-active-skin-hover-color: #fff !important;
  --epr-search-input-bg-color-active: var(--epr-search-input-bg-color);
  --epr-search-input-padding: 0 30px;
  --epr-search-input-border-radius: 8px;
  --epr-search-input-height: 40px;
  --epr-search-input-text-color: var(--epr-text-color);
  --epr-search-input-placeholder-color: var(--epr-text-color);
  --epr-search-bar-inner-padding: var(--epr-horizontal-padding);
  --epr-category-navigation-button-size: 30px;
  --epr-emoji-variation-picker-height: 45px;
  --epr-emoji-variation-picker-bg-color: var(--epr-bg-color);
  --epr-preview-height: 70px;
  --epr-preview-text-size: 14px;
  --epr-preview-text-padding: 0 var(--epr-horizontal-padding);
  --epr-preview-border-color: var(--epr-picker-border-color);
  --epr-preview-text-color: var(--epr-text-color);
  --epr-category-padding: 0 var(--epr-horizontal-padding);
  --epr-category-label-bg-color: #ffffffe6;
  --epr-category-label-text-color: var(--epr-text-color);
  --epr-category-label-padding: 0 var(--epr-horizontal-padding);
  --epr-category-label-height: 40px;
  --epr-emoji-size: 30px;
  --epr-emoji-padding: 5px;
  --epr-emoji-fullsize: calc(var(--epr-emoji-size) + var(--epr-emoji-padding)*2);
  --epr-emoji-hover-color: #273345 !important;
  --epr-emoji-variation-indicator-color: var(--epr-picker-border-color);
  --epr-emoji-variation-indicator-color-hover: var(--epr-text-color);
  --epr-header-overlay-z-index: 3;
  --epr-emoji-variations-indictator-z-index: 1;
  --epr-category-label-z-index: 2;
  --epr-skin-variation-picker-z-index: 5;
  --epr-preview-z-index: 6;
}

epr-btn epr-cat-btn {
  color: red !important;
  :hover {
    cursor: pointer;
    fill: rgba(255, 255, 255, 0.884) !important;
  }
}

.recharts-text .recharts-cartesian-axis-tick-value {
  color: red !important;
}

`



export default GlobalStyle
