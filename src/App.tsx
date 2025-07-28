import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import ProjectSidebar from './components/ProjectSidebar';
import LoginForm from './components/LoginForm';
import { useAuth } from './contexts/Auth';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="container mx-auto">
          <HeroSection />
        </main>
        <Footer />
      </div>

      {/* Project Sidebar */}
      <ProjectSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
    </div>
  );
}

export default App;