import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;