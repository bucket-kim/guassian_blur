import gsap from 'gsap';
import { FC, useEffect, useRef } from 'react';
import Page002StyleContainer from './Page002StyleContainer';

interface page002Props {
  isAnimating: boolean;
  activeSection: number;
}

const Page002: FC<page002Props> = ({ isAnimating, activeSection }) => {
  const mainDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainDivRef.current) return;

    if (isAnimating && activeSection !== 1) {
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
    <Page002StyleContainer ref={mainDivRef}>
      <div className="right-texts">
        <h2>
          Accelerating
          <br />
          Mainstream
          <br />
          Adoption
        </h2>
        <p>
          Seamless spending with your preferred assets, whether purchasing
          online or in-store. Experience the freedom of universal spending and
          join us in redefining the norm. Together, we make a difference, one
          transaction at a time.
        </p>
      </div>
      <div className="left-field">
        <h1>IMAGE!</h1>
      </div>
    </Page002StyleContainer>
  );
};

export default Page002;
