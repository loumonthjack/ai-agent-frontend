import React from 'react';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 mt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0"/>         
          <div className="flex items-center space-x-2 text-slate-400">
            <Zap size={16} />
            <span className="text-sm font-medium">By Loumonth Jack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;