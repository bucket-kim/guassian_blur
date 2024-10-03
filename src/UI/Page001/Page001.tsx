import Page001StyleContainer from './Page001StyleContainer';

const Page001 = () => {
  return (
    <Page001StyleContainer>
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
