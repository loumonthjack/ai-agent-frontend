import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService, Project } from '../services/apiService';

interface V0PreviewProps {
  projectId: string;
  onReset: () => void;
  project?: Project;
  isLoading?: boolean;
}

const V0Preview: React.FC<V0PreviewProps> = ({ projectId, onReset, project, isLoading: externalLoading }) => {
  const [currentProject, setCurrentProject] = useState<Project | undefined>(project);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;
    setCurrentProject(project);
    setPreviewUrl(project.previewUrl || null);
    setDeploymentUrl(project.deploymentUrl || null);
  }, [project]);

  useEffect(() => {
    if (!projectId || projectId.startsWith('temp_') || !currentProject) {
      return;
    }

    // Don't poll if project is already ready
    if (currentProject.status === 'READY') {
      return;
    }

    const pollProject = async () => {
      try {
        setLoading(true);
        console.log('Polling project:', projectId);
        const updatedProject = await apiService.getProject(projectId);
        console.log('Updated project:', updatedProject);
        setCurrentProject(updatedProject);
        
        if (updatedProject.websiteUrl) {
          setDeploymentUrl(updatedProject.websiteUrl);
        }
        if (updatedProject.previewUrl) {
          setPreviewUrl(updatedProject.previewUrl);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error polling project:', err);
        setError('Failed to update project status');
      } finally {
        setLoading(false);
      }
    };

    // Start polling immediately, then every 3 seconds
    pollProject();
    const interval = setInterval(pollProject, 3000);
    return () => clearInterval(interval);
  }, [projectId, currentProject?.status]);

  const refreshPreview = () => {
    if (previewUrl) {
      const iframe = document.getElementById('v0-preview') as HTMLIFrameElement;
      if (iframe) {
        // eslint-disable-next-line no-self-assign
        iframe.src = iframe.src;
      }
    }
  };

  const getStatusIcon = () => {
    switch (currentProject?.status) {
      case 'READY':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'BUILDING':
      case 'DESIGN':
      case 'TESTING':
      case 'DEPLOYING':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (currentProject?.status) {
      case 'BUILDING':
        return 'Analyzing requirements...';
      case 'DESIGN':
        return 'Designing website...';
      case 'TESTING':
        return 'Testing website...';
      case 'DEPLOYING':
        return 'Deploying website...';
      case 'READY':
        return 'Website ready!';
      case 'FAILED':
        return 'Generation failed';
      default:
        return 'Processing...';
    }
  };

  // Show loading state when external loading is true
  if (externalLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Creating Your Project</h3>
          <p className="text-slate-400">Setting up your website generation...</p>
        </div>
      </div>
    );
  }

  if (error && !currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-lg font-semibold text-white">
                {currentProject?.projectName || 'V0 Website'}
              </h2>
              <p className="text-sm text-slate-400">{getStatusText()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {previewUrl && (
              <button
                onClick={refreshPreview}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
                title="Refresh Preview"
              >
                <RefreshCw size={16} />
              </button>
            )}
            
            {deploymentUrl && (
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ExternalLink size={16} />
                <span>Open Live Site</span>
              </a>
            )}
            
            <button
              onClick={onReset}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        {currentProject?.status === 'BUILDING' || currentProject?.status === 'DESIGN' || currentProject?.status === 'TESTING' || currentProject?.status === 'DEPLOYING' || loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Generating Your Website</h3>
              <p className="text-slate-400">
                {currentProject?.status === 'BUILDING' && 'V0 is analyzing your requirements...'}
                {currentProject?.status === 'DESIGN' && 'V0 is designing your website...'}
                {currentProject?.status === 'TESTING' && 'V0 is testing your website...'}
                {currentProject?.status === 'DEPLOYING' && 'V0 is deploying your website...'}
                {!currentProject?.status && 'V0 is creating a custom website based on your requirements...'}
              </p>
            </div>
          </div>
        ) : currentProject?.status === 'FAILED' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Generation Failed</h3>
              <p className="text-slate-400 mb-4">
                There was an error generating your website. Please try again.
              </p>
              <button
                onClick={onReset}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : currentProject?.status === 'READY' && (previewUrl || deploymentUrl) ? (
          <iframe
            id="v0-preview"
            src={previewUrl || deploymentUrl || 'https://v0.dev/'}
            className="w-full h-full border-0"
            title="V0 Website Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        ) : currentProject?.status === 'READY' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Website Generated!</h3>
              <p className="text-slate-400 mb-4">
                Your website has been created successfully.
              </p>
              {deploymentUrl && (
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center space-x-2"
                >
                  <ExternalLink size={16} />
                  <span>View Live Website</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Initializing...</h3>
              <p className="text-slate-400">Setting up your project...</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {currentProject?.status === 'READY' && (deploymentUrl || previewUrl) && (
        <div className="bg-slate-800/50 border-t border-slate-700 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Website deployed with V0.dev
            </span>
            <div className="flex items-center space-x-4">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Preview URL
                </a>
              )}
              {deploymentUrl && (
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Live URL
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default V0Preview; 