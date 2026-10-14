import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SelectedWorks from './components/SelectedWorks';
import Explorations from './components/Explorations';
import Stats from './components/Stats';
import Experience from './components/Experience';
import SocialFeed from './components/SocialFeed';
import Resume from './components/Resume';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const handleLoaded = useCallback(() => setIsLoading(false), []);

  // The site renders behind the loader from the first frame (so it paints and
  // mounts early), but shouldn't be scrollable until the loader is gone.
  useEffect(() => {
    if (!isLoading) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  }, [isLoading]);

  return (
    <ErrorBoundary>
      <div className="relative bg-bg min-h-screen text-text-primary overflow-x-clip">
        <AnimatePresence>
          {isLoading && <LoadingScreen key="loader" onComplete={handleLoaded} />}
        </AnimatePresence>
        <Navbar />
        <main>
          <Hero ready={!isLoading} />
          <SocialFeed />
          <Experience />
          <SelectedWorks />
          <Explorations />
          <Stats />
          <Resume />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
