import gsap from 'gsap';
import { FC, useEffect, useRef } from 'react';
import Page001StyleContainer from './Page001StyleContainer';

interface page001Props {
  isAnimating: boolean;
  activeSection: number;
}

const Page001: FC<page001Props> = ({ isAnimating, activeSection }) => {
  const mainDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainDivRef.current) return;
    if (isAnimating && activeSection !== 0) {
      // Animate opacity from 1 to 0
      gsap.to(mainDivRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
    } else {
      // Reset opacity to 1 when not animating
      gsap.to(mainDivRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 0.5,
      });
    }
  }, [isAnimating, activeSection]);

  return (
    <Page001StyleContainer ref={mainDivRef}>
      <header>
        <h2>ampera</h2>
        <h2>menu</h2>
      </header>
      <div className="landing-hero">
        <div className="main-hero">
          <h3>
            ampera is <br />
            <span>payments movement</span>
          </h3>
        </div>
        <div className="sub-hero">
          <h4>for spending digital assets</h4>
          <button>scroll to explore</button>
        </div>
      </div>
    </Page001StyleContainer>
  );
};

export default Page001;
