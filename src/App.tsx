import { CursorProvider } from './components/CursorContext';
import CustomCursor from './components/CustomCursor';
import { ScrollWrapper } from './components/ScrollWrapper';
import NoiseOverlay from './components/NoiseOverlay';
import HeroSection from './components/HeroSection';

function App() {
  return (
    <CursorProvider>
      <ScrollWrapper>
        <div className="cursor-none bg-[#060606] min-h-screen text-white">
          <CustomCursor />
          <NoiseOverlay />
          <HeroSection />
        </div>
      </ScrollWrapper>
    </CursorProvider>
  );
}

export default App;
