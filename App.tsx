import React from 'react';
import HeroSection from './components/HeroSection';

const App: React.FC = () => {
  return (
    <main className="w-full min-h-screen bg-[#060606] text-white selection:bg-yellow-500 selection:text-black">
      <HeroSection />
    </main>
  );
};

export default App;