import React from 'react';
import HeroSection from './components/HeroSection';
import MainContent from './components/MainContent';
import { ScrollWrapper } from './components/ScrollWrapper';

const App = () => {
  return (
    <ScrollWrapper>
      <main className="w-full min-h-screen bg-[#060606] text-white selection:bg-yellow-500 selection:text-black">
        <HeroSection />
        <MainContent />
      </main>
    </ScrollWrapper>
  );
};

export default App;