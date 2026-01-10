import React from 'react';
import HeroSection from './components/HeroSection';
import MainContent from './components/MainContent';

const App: React.FC = () => {
  return (
    <main className="w-full min-h-screen bg-[#060606] text-white selection:bg-yellow-500 selection:text-black">
      <HeroSection />
      <MainContent />
    </main>
  );
};

export default App;