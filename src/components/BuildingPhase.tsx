import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Loader2, AlertCircle, ArrowLeft, ExternalLink, Clock, Zap, Code, TestTube, Globe, Settings } from 'lucide-react';
import { apiService, DeploymentStatus, Project } from '../services/apiService';
import { API_CONFIG } from '../config/api';

interface BuildingPhaseProps {
  projectId: string;
  onReset: () => void;
  project?: Project;
}

const BuildingPhase: React.FC<BuildingPhaseProps> = ({ projectId, onReset, project }) => {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [currentStepStartTime, setCurrentStepStartTime] = useState<number>(Date.now());

  const steps = [
    { 
      key: 'generateCode', 
      label: 'Generating Code', 
      description: 'AI is analyzing your requirements and creating custom code...',
      icon: Code,
      estimatedTime: '2-4 minutes',
      details: 'Our AI is crafting frontend components, backend APIs, and database schemas'
    },
    { 
      key: 'runTests', 
      label: 'Running Tests', 
      description: 'Validating code quality and functionality...',
      icon: TestTube,
      estimatedTime: '1-2 minutes',
      details: 'Running unit tests, integration tests, and code quality checks'
    },
    { 
      key: 'deployFrontend', 
      label: 'Deploy Frontend', 
      description: 'Setting up your user interface...',
      icon: Globe,
      estimatedTime: '30-60 seconds',
      details: 'Deploying React app, configuring CDN, and setting up hosting'
    },
    { 
      key: 'deployBackend', 
      label: 'Deploy Backend', 
      description: 'Configuring your server infrastructure...',
      icon: Settings,
      estimatedTime: '1-2 minutes',
      details: 'Setting up serverless functions, databases, and API endpoints'
    },
  ];

  const formatElapsedTime = (startTime: number): string => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentStep = (): typeof steps[0] | null => {
    if (!deploymentStatus) return steps[0];
    
    for (const step of steps) {
      const stepStatus = deploymentStatus.steps[step.key as keyof typeof deploymentStatus.steps];
      if (stepStatus === 'RUNNING') {
        return step;
      }
      if (stepStatus === 'PENDING') {
        return step;
      }
    }
    return null;
  };

  const getCompletedSteps = (): number => {
    if (!deploymentStatus) return 0;
    return steps.filter(step => {
      const stepStatus = deploymentStatus.steps[step.key as keyof typeof deploymentStatus.steps];
      return stepStatus === 'SUCCEEDED';
    }).length;
  };

  const startDeployment = async () => {
    try {
      const deployment = await apiService.createDeployment(projectId);
      setDeploymentId(deployment.id);
      setCurrentStepStartTime(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start deployment');
      console.error('Deployment error:', err);
    }
  };

  const pollDeploymentStatus = async () => {
    if (!deploymentId) return;

    try {
      const status = await apiService.getDeploymentStatus(projectId, deploymentId);
      
      // Check if we moved to a new step
      const currentStep = getCurrentStep();
      const newCurrentStep = steps.find(step => {
        const stepStatus = status.steps[step.key as keyof typeof status.steps];
        return stepStatus === 'RUNNING';
      });
      
      if (newCurrentStep && currentStep && newCurrentStep.key !== currentStep.key) {
        setCurrentStepStartTime(Date.now());
      }
      
      setDeploymentStatus(status);

      // Stop polling if completed
      if (status.status === 'SUCCEEDED' || status.status === 'FAILED') {
        return;
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  };

  useEffect(() => {
    startDeployment();
  }, [projectId]);

  useEffect(() => {
    if (!deploymentId) return;

    // Poll based on config
    const interval = setInterval(pollDeploymentStatus, API_CONFIG.POLL_INTERVAL);
    
    // Initial poll
    pollDeploymentStatus();

    return () => clearInterval(interval);
  }, [deploymentId]);

  const getStepIcon = (stepKey: string, IconComponent: React.ComponentType<any>) => {
    if (!deploymentStatus) return <Circle size={20} className="text-slate-500" />;
    
    const stepStatus = deploymentStatus.steps[stepKey as keyof typeof deploymentStatus.steps];
    
    switch (stepStatus) {
      case 'SUCCEEDED':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'RUNNING':
        return <IconComponent size={20} className="text-blue-400 animate-pulse" />;
      case 'FAILED':
        return <AlertCircle size={20} className="text-red-400" />;
      default:
        return <Circle size={20} className="text-slate-500" />;
    }
  };

  const getStepClass = (stepKey: string) => {
    if (!deploymentStatus) return 'text-slate-500';
    
    const stepStatus = deploymentStatus.steps[stepKey as keyof typeof deploymentStatus.steps];
    
    switch (stepStatus) {
      case 'SUCCEEDED':
        return 'text-green-400';
      case 'RUNNING':
        return 'text-blue-400';
      case 'FAILED':
        return 'text-red-400';
      default:
        return 'text-slate-500';
    }
  };

  if (error) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 mb-8">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Build Failed</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={onReset}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft size={18} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Show website link immediately if project already has websiteUrl (READY status)
  if (project?.websiteUrl && !deploymentStatus) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8 mb-8">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-400 mb-2">Website Ready!</h2>
          <p className="text-slate-300 mb-6">Your AI-generated website is already live and ready to view.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <ExternalLink size={18} />
              <span>View Website</span>
            </a>
          </div>
          
          <button
            onClick={onReset}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft size={18} />
            <span>Build Something New</span>
          </button>
        </div>
      </div>
    );
  }

  if (deploymentStatus?.status === 'SUCCEEDED') {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8 mb-8">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-400 mb-2">Build Complete!</h2>
          <p className="text-slate-300 mb-4">Your application has been successfully deployed.</p>
          
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Total time: {formatElapsedTime(startTime)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap size={14} />
                <span>{getCompletedSteps()}/{steps.length} steps completed</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            {project?.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ExternalLink size={18} />
                <span>View Website</span>
              </a>
            )}
            {deploymentStatus.outputs?.frontendUrl && (
              <a
                href={deploymentStatus.outputs.frontendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ExternalLink size={18} />
                <span>View Frontend</span>
              </a>
            )}
            {deploymentStatus.outputs?.backendUrl && (
              <a
                href={deploymentStatus.outputs.backendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ExternalLink size={18} />
                <span>View Backend</span>
              </a>
            )}
          </div>
          
          <button
            onClick={onReset}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft size={18} />
            <span>Build Something New</span>
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStep();
  const completedSteps = getCompletedSteps();
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Loader2 className="text-blue-400 animate-spin" size={48} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-400">{completedSteps}</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Building Your App</h2>
        <p className="text-slate-400 mb-2">Sit back and relax while AI creates your application</p>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{completedSteps}/{steps.length} steps completed</span>
            <span>Elapsed: {formatElapsedTime(startTime)}</span>
          </div>
        </div>

        {/* Current Step Highlight */}
        {currentStep && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <Loader2 size={16} className="text-blue-400 animate-spin" />
              <span className="text-blue-400 font-semibold">{currentStep.label}</span>
              <span className="text-slate-400 text-sm">({currentStep.estimatedTime})</span>
            </div>
            <p className="text-slate-300 text-sm mb-1">{currentStep.details}</p>
            <p className="text-slate-500 text-xs">Step time: {formatElapsedTime(currentStepStartTime)}</p>
          </div>
        )}

        {/* Steps List */}
        <div className="space-y-4 mb-6">
          {steps.map((step) => (
            <div key={step.key} className="flex items-start space-x-4 text-left">
              {getStepIcon(step.key, step.icon)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className={`font-semibold ${getStepClass(step.key)}`}>
                    {step.label}
                  </h3>
                  <span className="text-slate-500 text-xs">({step.estimatedTime})</span>
                </div>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-700">
          <button
            onClick={onReset}
            className="text-slate-400 hover:text-white transition-colors flex items-center space-x-2 mx-auto text-sm"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingPhase; 