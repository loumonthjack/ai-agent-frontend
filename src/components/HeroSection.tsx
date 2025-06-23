import React, { useState } from 'react';
import { ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import BuildingPhase from './BuildingPhase';
import { apiService } from '../services/apiService';

const HeroSection = () => {
  const [inputValue, setInputValue] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creationProgress, setCreationProgress] = useState('');

  const generateProjectName = (prompt: string): string => {
    // Extract key words from prompt and create a project name
    const words = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter out small words
      .slice(0, 3); // Take first 3 meaningful words
    
    let projectName = words.join('-') || 'ai-generated-app';
    
    // Ensure project name meets backend validation requirements
    // Must be 3-50 characters and contain only alphanumeric, spaces, hyphens, underscores
    projectName = projectName.replace(/[^a-zA-Z0-9\s\-_]/g, ''); // Remove invalid chars
    
    if (projectName.length < 3) {
      projectName = 'ai-generated-app';
    }
    
    if (projectName.length > 50) {
      projectName = projectName.substring(0, 50);
    }
    
    return projectName;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const prompt = inputValue.trim();
    
    if (!prompt) return;
    
    // Validate prompt length (matching backend validation)
    if (prompt.length < 50) {
      setError('Please provide a more detailed description (at least 50 characters)');
      return;
    }
    
    if (prompt.length > 2000) {
      setError('Description is too long (maximum 2000 characters)');
      return;
    }

    setIsCreatingProject(true);
    setError(null);
    
    try {
      // Step 1: Create project (fast, returns immediately)
      setCreationProgress('Creating project...');
      const projectName = generateProjectName(prompt);
      const description = prompt.length > 200 ? prompt.substring(0, 197) + '...' : prompt;
      
      const project = await apiService.createProject({
        projectName,
        prompt,
        description
      });

      setProjectId(project.id);

      // Step 2: Wait for AI generation to complete (this is the long process)
      setCreationProgress('AI is analyzing your requirements...');
      
      await apiService.waitForProjectReady(project.id, (status) => {
        switch (status) {
          case 'BUILDING':
            setCreationProgress('AI is generating your application structure...');
            break;
          case 'DESIGN':
            setCreationProgress('AI generation complete! Preparing for deployment...');
            break;
          default:
            setCreationProgress('Processing...');
        }
      });

      // Step 3: Project is ready, start building phase
      setCreationProgress('Starting deployment process...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsCreatingProject(false);
      setIsBuilding(true);
      
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'Failed to create project');
      setIsCreatingProject(false);
      setCreationProgress('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleReset = () => {
    setIsBuilding(false);
    setIsCreatingProject(false);
    setProjectId(null);
    setInputValue('');
    setError(null);
    setCreationProgress('');
  };

  if (isBuilding && projectId) {
    return <BuildingPhase projectId={projectId} onReset={handleReset} />;
  }

  // Project Creation Loading State (includes AI generation)
  if (isCreatingProject) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="text-blue-400 animate-pulse" size={48} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Creating Your AI-Powered App</h2>
          <p className="text-slate-400 mb-6">Our AI is analyzing your requirements and designing your application...</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 size={16} className="text-blue-400 animate-spin" />
              <span className="text-blue-400 font-medium">{creationProgress}</span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" 
                   style={{ width: '60%' }}></div>
            </div>
            
            <p className="text-slate-500 text-sm">
              This process can take 2-5 minutes as our AI generates your complete application
            </p>
          </div>

          <button
            onClick={handleReset}
            className="mt-6 text-slate-400 hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
        What do you want to{' '}
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          build?
        </span>
      </h1>
      
      <p className="text-xl text-slate-400 mb-12 leading-relaxed">
        Create stunning apps & websites by chatting with AI.
      </p>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-left">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-8">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How can we help you today?"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 pr-20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg resize-none"
            rows={1}
            disabled={isCreatingProject}
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || inputValue.trim().length < 50 || isCreatingProject}
            className="absolute right-4 bottom-6 text-slate-400 hover:text-white transition-colors p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingProject ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
        </div>
        
        {/* Character counter */}
        <div className="flex justify-between mt-2 text-sm">
          <span className={`${
            inputValue.length < 50 
              ? 'text-orange-400' 
              : inputValue.length > 2000 
                ? 'text-red-400' 
                : 'text-green-400'
          }`}>
            {inputValue.length < 50 
              ? `${50 - inputValue.length} more characters needed`
              : inputValue.length > 2000
                ? `${inputValue.length - 2000} characters over limit`
                : 'Ready to build!'
            }
          </span>
          <span className="text-slate-500">
            {inputValue.length}/2000
          </span>
        </div>
      </form>
    </div>
  );
};

export default HeroSection;