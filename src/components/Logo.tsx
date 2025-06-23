import React from 'react';
import { Zap } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
        <Zap className="text-white" size={20} />
      </div>
      <span className="text-xl font-bold text-white">AI Agent</span>
    </div>
  );
};

export default Logo;