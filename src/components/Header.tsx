import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import SocialLinks from './SocialLinks';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Globe className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-light text-white tracking-tight">Admin Agent</h1>
            <p className="text-sm text-slate-400 hidden sm:block font-light">AI-Powered Application Builder</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Desktop Social Links */}
          <div className="hidden md:flex">
            <SocialLinks />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-center">
              <SocialLinks />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;