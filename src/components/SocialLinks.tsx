import React from 'react';
import { MessageCircle, Linkedin, Github } from 'lucide-react';

const SocialLinks = () => {
  return (
    <div className="flex items-center space-x-3">
      <a
        href="mailto:me@loumonthjack.com"
        className="text-slate-400 hover:text-white transition-colors"
        aria-label="Discord"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href="https://www.linkedin.com/in/loumonth-jack-jr"
        className="text-slate-400 hover:text-white transition-colors"
        aria-label="LinkedIn"
      >
        <Linkedin size={20} />
      </a>
      <a
        href="https://github.com/loumonthjack"
        className="text-slate-400 hover:text-white transition-colors"
        aria-label="Reddit"
      >
        <Github size={20} />
      </a>
    </div>
  );
};

export default SocialLinks;