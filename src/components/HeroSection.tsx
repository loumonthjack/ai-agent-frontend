import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Info, Sparkles, Building2, Users, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { apiService, CreateProjectRequest, Project } from '../services/apiService';
import V0Preview from './V0Preview';

const HeroSection = () => {
  const [prompt, setPrompt] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'modern' | 'elegant' | 'playful' | 'corporate' | 'creative' | 'minimalist'>('professional');
  const [colorPreference, setColorPreference] = useState<'blue' | 'green' | 'purple' | 'orange' | 'red' | 'neutral' | 'dark' | 'colorful' | 'minimal'>('blue');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [showSplitView, setShowSplitView] = useState(false);
  
  // New design states
  const [fontFamily, setFontFamily] = useState<'sans-serif' | 'serif' | 'display' | 'handwritten' | 'monospace' | 'custom'>('sans-serif');
  const [layoutStyle, setLayoutStyle] = useState<'centered' | 'full-width' | 'sidebar-left' | 'sidebar-right' | 'asymmetric' | 'magazine'>('centered');
  const [headerStyle, setHeaderStyle] = useState<'fixed' | 'transparent' | 'solid' | 'minimal' | 'bold' | 'classic'>('fixed');
  const [buttonStyle, setButtonStyle] = useState<'rounded' | 'square' | 'pill' | 'ghost' | 'gradient' | '3d'>('rounded');
  const [animationLevel, setAnimationLevel] = useState<'none' | 'subtle' | 'moderate' | 'rich'>('moderate');
  const [typographyScale, setTypographyScale] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium');
  const [spacing, setSpacing] = useState<'compact' | 'normal' | 'spacious' | 'airy'>('normal');
  const [sectionStyle, setSectionStyle] = useState<'flat' | 'cards' | 'waves' | 'geometric' | 'gradient' | 'parallax'>('flat');

  // Update character count when prompt changes
  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Clean and corporate' },
    { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
    { value: 'modern', label: 'Modern', description: 'Cutting-edge and trendy' },
    { value: 'elegant', label: 'Elegant', description: 'Sophisticated and refined' },
    { value: 'playful', label: 'Playful', description: 'Fun and energetic' },
    { value: 'corporate', label: 'Corporate', description: 'Business-focused' },
    { value: 'creative', label: 'Creative', description: 'Artistic and unique' },
    { value: 'minimalist', label: 'Minimalist', description: 'Simple and clean' }
  ];

  const colorOptions = [
    { value: 'blue', label: 'Blue', hex: '#3B82F6' },
    { value: 'green', label: 'Green', hex: '#10B981' },
    { value: 'purple', label: 'Purple', hex: '#8B5CF6' },
    { value: 'orange', label: 'Orange', hex: '#F97316' },
    { value: 'red', label: 'Red', hex: '#EF4444' },
    { value: 'neutral', label: 'Neutral', hex: '#6B7280' },
    { value: 'dark', label: 'Dark', hex: '#1F2937' },
    { value: 'colorful', label: 'Colorful', hex: 'linear-gradient(to right, #3B82F6, #8B5CF6)' },
    { value: 'minimal', label: 'Minimal', hex: '#F3F4F6' }
  ];

  const featuresOptions = [
    'Contact Form', 'Image Gallery', 'About Section', 'Services Page',
    'Testimonials', 'Team Page', 'Blog', 'Portfolio', 'Pricing Tables',
    'FAQ Section', 'Newsletter Signup', 'Social Media Links',
    'Google Maps', 'Search Functionality', 'Multi-language Support', 'E-commerce'
  ];

  const industryOptions = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'Real Estate',
    'Restaurant', 'Retail', 'Consulting', 'Creative Agency', 'Non-profit',
    'Fitness', 'Beauty', 'Legal', 'Construction', 'Manufacturing', 'Other'
  ];

  const generateProjectName = (businessName: string): string => {
    const sanitized = businessName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    return sanitized || `Website-${Date.now()}`;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    // Enhanced validation
    if (!businessName.trim()) {
      setError('Please enter your business name');
      return;
    }

    if (!industry) {
      setError('Please select your industry');
      return;
    }

    if (prompt.length < 50) {
      setError('Please provide more details about your website (minimum 50 characters)');
      return;
    }

    if (prompt.length > 2000) {
      setError('Description is too long (maximum 2000 characters)');
      return;
    }

    setIsLoading(true);
    setShowSplitView(true);
    setError(null);

    try {
      const enrichedPrompt = `
        Create a ${tone} website for ${businessName}, a ${industry} business.
        Target audience: ${targetAudience || 'general public'}.
        
        Specific requirements:
        ${prompt}
        
        Features needed: ${selectedFeatures.join(', ') || 'standard business features'}.
        
        Use a ${colorPreference} color scheme with a ${tone} design approach.
        Font style: ${fontFamily}, Layout: ${layoutStyle}, Animation: ${animationLevel}.
      `.trim();

      const request: CreateProjectRequest = {
        projectName: generateProjectName(businessName),
        description: `${tone} website for ${businessName} - ${industry}`,
        prompt: enrichedPrompt,
        businessDetails: {
          businessName,
          industry,
          targetAudience,
          tone,
          colorPreference,
          features: selectedFeatures,
          fontFamily,
          layoutStyle,
          headerStyle,
          buttonStyle,
          animationLevel,
          typographyScale,
          spacing,
          sectionStyle
        }
      };

      // Create project and get immediate response with projectId
      const createdProject = await apiService.createProject(request);
      console.log('Created project:', createdProject);
      
      // Set the project immediately with the returned projectId
      setProjectId(createdProject.projectId);
      setProject(createdProject);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setShowSplitView(false);
      setProjectId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleReset = () => {
    setProjectId(null);
    setProject(null);
    setPrompt('');
    setBusinessName('');
    setIndustry('');
    setTargetAudience('');
    setTone('professional');
    setColorPreference('blue');
    setSelectedFeatures([]);
    setIsLoading(false);
    setError(null);
    setShowAdvanced(false);
    setCharCount(0);
    setShowSplitView(false);
    // Reset new design states
    setFontFamily('sans-serif');
    setLayoutStyle('centered');
    setHeaderStyle('fixed');
    setButtonStyle('rounded');
    setAnimationLevel('moderate');
    setTypographyScale('medium');
    setSpacing('normal');
    setSectionStyle('flat');
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // Split view when showing preview
  if (showSplitView && projectId) {
    return (
      <div className="h-screen flex">
        {/* Left Panel - Form */}
        <div className="w-1/2 flex flex-col border-r border-slate-700">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Sparkles className="text-blue-400" size={32} />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    LouAI
                  </h1>
                </div>
                <p className="text-lg text-slate-300 mb-2">
                  V0-Powered Website Generation
                </p>
                <p className="text-slate-400">
                  {isLoading ? 'Your website is being generated with V0.dev' : 'Your website is ready!'}
                </p>
              </div>

              {/* Project Summary */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-400">Business:</span>
                    <span className="text-white ml-2">{businessName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Industry:</span>
                    <span className="text-white ml-2">{industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Style:</span>
                    <span className="text-white ml-2">{tone} • {colorPreference}</span>
                  </div>
                  {selectedFeatures.length > 0 && (
                    <div>
                      <span className="text-slate-400">Features:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedFeatures.map(feature => (
                          <span key={feature} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">Requirements:</span>
                    <p className="text-white mt-1 text-xs leading-relaxed">{prompt}</p>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="text-red-400 mt-0.5" size={20} />
                    <p className="text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  New Project
                </button>
                {project?.websiteUrl && !isLoading && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    View Live Site
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - V0 Preview */}
        <div className="w-1/2">
          <V0Preview 
            projectId={projectId}
            onReset={handleReset} 
            project={project || undefined}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  // Original full-width form view
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Sparkles className="text-blue-400" size={40} />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LouAI
          </h1>
        </div>
        <p className="text-xl text-slate-300 mb-2">
          Create a custom web apps powered by V0.dev
        </p>
        <p className="text-slate-400">
          Describe your vision and watch V0 bring it to life with live preview
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 shadow-2xl">
          
          {/* Business Name */}
          <div className="mb-6">
            <label htmlFor="businessName" className="block text-sm font-medium text-slate-300 mb-2 flex items-center space-x-2">
              <Building2 size={16} />
              <span>Business Name *</span>
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your business name"
              required
            />
          </div>

          {/* Industry (Required) */}
          <div className="mb-6">
            <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2 flex items-center space-x-2">
              <Users size={16} />
              <span>Industry *</span>
            </label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select your industry</option>
              {industryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Website Description */}
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Wand2 size={16} />
                <span>Describe Your Website Vision *</span>
              </span>
              <span className={`text-xs ${charCount < 50 ? 'text-yellow-400' : charCount > 1900 ? 'text-red-400' : 'text-slate-400'}`}>
                {charCount}/2000
              </span>
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-none"
              placeholder="Describe what you want your website to do, what pages you need, special features, and any specific requirements... (minimum 50 characters)"
              required
              minLength={50}
              maxLength={2000}
            />
            {charCount < 50 && charCount > 0 && (
              <p className="text-yellow-400 text-xs mt-1">Please provide at least {50 - charCount} more characters</p>
            )}
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <span>Advanced Options</span>
          </button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-6 mb-6 p-6 bg-slate-900/30 rounded-xl border border-slate-600">
              {/* Target Audience */}
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-300 mb-2">
                  Target Audience
                </label>
                <input
                  id="targetAudience"
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Small business owners, Young professionals, Families"
                />
              </div>

              {/* Design Tone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Design Tone
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {toneOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTone(option.value as 'professional' | 'casual' | 'modern' | 'elegant' | 'playful' | 'corporate' | 'creative' | 'minimalist')}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        tone === option.value
                          ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                          : 'border-slate-600 bg-slate-900/30 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-75">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Preference */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Color Scheme
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {colorOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColorPreference(option.value as 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'neutral' | 'dark' | 'colorful' | 'minimal')}
                      className={`p-3 rounded-lg border transition-all ${
                        colorPreference === option.value
                          ? 'border-blue-500 bg-blue-600/20'
                          : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg mb-2 mx-auto"
                        style={{ 
                          background: option.hex 
                        }}
                      />
                      <div className="text-xs text-center text-slate-300">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Website Features
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {featuresOptions.map(feature => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`p-2 text-sm rounded-lg border transition-all ${
                        selectedFeatures.includes(feature)
                          ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                          : 'border-slate-600 bg-slate-900/30 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="text-red-400 mt-0.5" size={20} />
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || charCount < 50 || !businessName || !industry}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>V0 is creating your website...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Website</span>
              </>
            )}
          </button>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="text-blue-400 mt-0.5" size={20} />
              <div className="text-sm text-slate-300">
                <p className="font-medium mb-1">Powered by V0.dev:</p>
                <ul className="space-y-1 text-slate-400">
                  <li>• AI analyzes your requirements and creates a custom web app</li>
                  <li>• Real-time preview with live deployment</li>
                  <li>• Modern React + Next.js with Tailwind CSS</li>
                  <li>• Production-ready hosting on Vercel</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroSection;