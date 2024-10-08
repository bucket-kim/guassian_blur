import { useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Page001 from './Page001/Page001';
import Page002 from './Page002/Page002';
import Page003 from './Page003/Page003';
import UIStyleContainer from './UIStyleContainer';

const UI = () => {
  const page1Ref = useRef<HTMLDivElement>(null);

  const page002Ref = useRef<HTMLDivElement>(null);

  const [swiper, setSwiper] = useState(null);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  return (
    <UIStyleContainer>
      <Page001 activeSection={activeSection} isAnimating={isAnimating} />
      <Swiper
        modules={[Mousewheel]}
        slidesPerView={1}
        speed={1500}
        direction={'vertical'}
        mousewheel={{ thresholdDelta: 30 }}
        freeMode={false}
        onSlideChange={(swiper) => {
          console.log(swiper.activeIndex);
          setActiveSection(swiper.activeIndex);
          setIsAnimating(true);
        }}
        // @ts-ignore
        onSwiper={setSwiper}
      >
        <SwiperSlide>
          <div style={{ width: '100%', height: '100%' }}></div>
        </SwiperSlide>
        <SwiperSlide>
          <Page002 activeSection={activeSection} isAnimating={isAnimating} />
          <div style={{ width: '100%', height: '100%' }}></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="page-2">
            <Page003 />
          </div>
        </SwiperSlide>
      </Swiper>
    </UIStyleContainer>
  );
};

export default UI;
