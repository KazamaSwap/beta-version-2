import React, { useEffect, useState } from 'react'
import { Box, Flex, Image, ProgressTopBar, ProgressBar } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Pagination, Autoplay, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const StyledBox = styled.div`
  height: 250px;
  max-width: 920px;
  width: 100%;
  cursor: pointer;
  padding: 0px 30px;
`

const SwiperWrapper = styled.div`
background: radial-gradient(50% 100% at 50% 0,rgba(238, 26, 121, 0.082) 55%,rgba(200,53,78,0) 100%);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: calc(100% - 10.5rem);
    transform: matrix(1,0,0,-1,0,0);
    z-index: 1;
`

const ProgressContainer = styled.div`
background: #201c29;
border-radius: 2px;
bottom: 0;
height: 0.2rem;
left: 0;
overflow: hidden;
position: absolute;
right: 0;
`

function sanitisePercentage(i) {
  return Math.min(100, Math.max(0, i))
}

let percentTime
let tick
let delta = 0

const TopSliderBar = () => {
  const [prog, setProgress] = useState(0)

  function updateSwiperProgressBar(slideDelay, mySwiper) {
    if (!mySwiper) return

    function startProgressBar() {
      resetProgressBar()
      tick = setInterval(progress, 200)
    }

    function progress() {
      delta += 200

      if (mySwiper.autoplay?.running && !mySwiper.autoplay.paused) {
        percentTime = sanitisePercentage(Math.round((delta / slideDelay) * 100))
        setProgress(percentTime)

        if (percentTime > 100) {
          resetProgressBar()
        }
      }

      if (mySwiper.autoplay.paused) {
        percentTime = 0
        setProgress(0)
      }
    }

    function resetProgressBar() {
      percentTime = 0
      delta = 0
      setProgress(0)
      clearInterval(tick)
    }

    startProgressBar()
  }

  const barData = [
    {
      img: 'https://cdnv1.csgo500.com/casino/carousel/1/tablet/c234561f-acd1-4aa9-991a-f0969b0ad2f0.png',
      link: 'https://apeswap.finance/treasury-bills?id=29',
    },
    {
      img: 'https://cdnv1.csgo500.com/casino/carousel/3/tablet/0abea655-ca98-416d-8433-ccb6e10838db.png',
      link: 'https://apeswap.finance/banana-farms',
    },
    {
      img: 'https://cdnv1.csgo500.com/casino/carousel/0/tablet/3117fcdb-740f-42c6-be9c-eed4d2068be2.png',
      link: 'https://apeswap.finance/banana-farms',
    },
    {
      img: 'https://cdnv1.csgo500.com/casino/carousel/2/tablet/ed6df3c6-36b2-4094-9101-f2ab491d02c3.png',
      link: 'https://apeswap.finance/nft',
    },
  ]

  return (
    <>
      <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        modules={[Autoplay, Pagination, Navigation]}
        navigation
        className="top-side-bar"
        onSlideChange={(swiper) => {
          // const swiper = this;
          const defaultSlideDelay = swiper.params.autoplay.delay
          const currentIndex = swiper.realIndex + 1
          const currentSlide = swiper.slides[currentIndex]
          const currentSlideDelay = currentSlide.getAttribute('data-swiper-autoplay') || defaultSlideDelay

          updateSwiperProgressBar(currentSlideDelay, swiper)
        }}
      >
        {barData.map((bar) => {
          return (
            <SwiperSlide>
              <StyledBox
                onClick={() => {
                  window.open(bar.link, '_blank')
                }}
              >
                <img src={bar.img} alt="Top Bar" />
                  <ProgressTopBar>
                  <ProgressContainer>
                    <ProgressBar $useDark $background="#EE1A78" style={{ width: `${prog}%`, height: "3px" }} />
                    </ProgressContainer>
                  </ProgressTopBar>
          
              </StyledBox>
            </SwiperSlide>
          )
        })}
         <SwiperWrapper />
      </Swiper>
    </>
  )
}

export default TopSliderBar
