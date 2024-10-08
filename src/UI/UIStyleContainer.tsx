import styled from 'styled-components';

const UIStyleContainer = styled.div`
  margin: 0;
  height: 100%;
  width: 100%;

  .swiper {
    height: 100vh; /* or any specific height you need */
  }

  .swiper-slide {
    width: 100%;
    height: 100%; /* Ensures slide takes full height */
  }
`;

export default UIStyleContainer;
