import styled from 'styled-components';

const Page001StyleContainer = styled.div`
  height: 100vh;
  width: 100%;
  color: blue;
  padding: 0rem 4rem;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  z-index: 2;
  pointer-events: none;

  header {
    height: 4rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .landing-hero {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .main-hero {
      position: absolute;
      top: 10rem;
      left: 0rem;
      /* margin: auto; */
    }
    .sub-hero {
      position: absolute;
      top: 50%;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
`;

export default Page001StyleContainer;
