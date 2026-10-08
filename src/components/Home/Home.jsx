import React from 'react';
import ScrollFrameAnimation from '../ScrollFrameAnimation';

const Home = () => {
  return (
    <div className="home-page">
      <ScrollFrameAnimation 
        framePathPrefix="/frames/ezgif-frame-"
        frameCount={196}
        frameExtension=".jpg"
        scrollHeight="700vh"
      />
    </div>
  );
};

export default Home;
