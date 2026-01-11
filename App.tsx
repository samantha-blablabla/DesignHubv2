import React from 'react';
import HeroSection from './components/HeroSection';
import MainContent from './components/MainContent';
import { ScrollWrapper } from './components/ScrollWrapper';
import { CursorProvider } from './components/CursorContext';
import CustomCursor from './components/CustomCursor';
import NoiseOverlay from './components/NoiseOverlay';

const App = () => {
  return (
    <CursorProvider>
      <ScrollWrapper>
        <div className="cursor-none"> {/* Hide default cursor */}
          <CustomCursor />
          <NoiseOverlay />
          <main className="w-full min-h-screen bg-[#060606] text-white selection:bg-yellow-500 selection:text-black">
            <HeroSection />
            <MainContent />
          </main>
        </div>
      </ScrollWrapper>
    </CursorProvider>
  );
};

export default App;