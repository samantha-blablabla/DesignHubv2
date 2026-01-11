import { CursorProvider } from './components/CursorContext';
import CustomCursor from './components/CustomCursor';
import { ScrollWrapper } from './components/ScrollWrapper';
import NoiseOverlay from './components/NoiseOverlay';
import HeroSection from './components/HeroSection';
import ResourceGallery from './components/ResourceGallery';
import VideoShowcase from './components/VideoShowcase';
import BigFooter from './components/BigFooter';

function App() {
  return (
    <CursorProvider>
      <ScrollWrapper>
        <div className="cursor-none bg-[#060606] min-h-screen text-white">
          <CustomCursor />
          <NoiseOverlay />
          <HeroSection />
          <ResourceGallery />
          <VideoShowcase />
          <BigFooter />
        </div>
      </ScrollWrapper>
    </CursorProvider>
  );
}

export default App;
