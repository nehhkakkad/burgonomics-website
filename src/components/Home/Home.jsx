import React from 'react';
import ScrollFrameAnimation from '../ScrollFrameAnimation';

const Home = () => {
  return (
    <div className="home-page">
      <ScrollFrameAnimation
        videoSrc="/video/burger-scroll-1bd57062.mp4"
        framePathPrefix="/frames/ezgif-frame-"
        frameCount={197}
        frameExtension=".jpg"
        scrollHeight="700vh"
      />
    </div>
  );
};

export default Home;
