// src/components/ProjectCard.tsx
import React from 'react';
import { Project } from '../services/apiService';

interface ProjectCardProps {
  project: Project;
  isSelected?: boolean;
  onSelect: (project: Project) => void;
}

export default function ProjectCard({ project, isSelected = false, onSelect }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY':
        return 'bg-green-500';
      case 'BUILDING':
      case 'DESIGN':
      case 'TESTING':
      case 'DEPLOYING':
        return 'bg-yellow-500';
      case 'FAILED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-400 ${
        isSelected 
          ? 'bg-blue-500/10 border-blue-400' 
          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70'
      }`}
      onClick={() => onSelect(project)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white truncate">{project.projectName}</h3>
        <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)} flex-shrink-0 ml-2`} />
      </div>

      
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="uppercase font-medium">{project.status}</span>
        <span>{formatDate(project.createdAt)}</span>
      </div>
      
      {project.assets?.websiteUrl && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <a
            href={project.assets.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Site
          </a>
        </div>
      )}
    </div>
  );
} 