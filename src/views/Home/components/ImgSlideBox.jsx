import { Box, Flex, LinkExternal } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

const StyledBox = styled.div`
  border-radius: 10px;
  height: 340px;
  min-width: 266px;
  cursor: pointer;
  margin-bottom: 50px;
`
const ImgSlideBox = () => {
  const cardData = [
    {img: "https://res.cloudinary.com/dswmrqgwy/image/upload/v1667589336/Cards_3_AIR_TB_9dac75ca79.png", link: "https://apeswap.finance/treasury-bills?id=29"},
    {img: "https://res.cloudinary.com/dswmrqgwy/image/upload/v1667404928/Card_s_TLOS_Farm_707273606a.jpg", link: "https://apeswap.finance/banana-farms"},
    {img: "https://res.cloudinary.com/dswmrqgwy/image/upload/v1667239437/Card_3_AIR_Farm_e8e56fb07c.jpg", link: "https://apeswap.finance/banana-farms"},
    {img: "https://res.cloudinary.com/dswmrqgwy/image/upload/v1666734660/Card_Telos_Stake_159c9ced19.jpg", link: "https://apeswap.finance/nft"},
    {img: "https://res.cloudinary.com/dswmrqgwy/image/upload/v1665776514/Card_Newsletter_18c1654302.jpg", link: "https://apeswap.finance/treasury-bills"},
    {img: "https://res.cloudinary.com/dswmrqgwy/image/upload/v1666302263/8_62d39f87d9.jpg", link: "https://apeswap.finance/pools"},
    {img: "https://res.cloudinary.com/dswmrqgwy/image/upload/v1667577223/Card_Telos_Quest_ff08485e2f.jpg", link: "https://apeswap.finance/treasury-bills"},
    {img: "https://res.cloudinary.com/dswmrqgwy/image/upload/v1667404928/Card_s_TLOS_Farm_707273606a.jpg", link: "https://apeswap.finance/banana-farms"}
  ]
  return (
    <>
      <Swiper
          slidesPerView={5}
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
      >
        {cardData.map((card) => {
          return (

            <SwiperSlide>
              <StyledBox style={{background: `url(${card.img}) center center / cover no-repeat`}} onClick={()=> {window.open(card.link, "_blank")}} />
            </SwiperSlide>
          )
        })}
        
         {/* <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>  */}

      </Swiper>
    </>
  )
}

export default ImgSlideBox
