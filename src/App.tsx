import { useState } from 'react';
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

  return (
    <div className="relative bg-bg min-h-screen text-text-primary overflow-x-clip">
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <Navbar />
          <main>
            <Hero />
            <SocialFeed />
            <Experience />
            <SelectedWorks />
            <Explorations />
            <Stats />
            <Resume />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
