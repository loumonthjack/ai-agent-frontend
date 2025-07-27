// src/components/ProjectSidebar.tsx
import React, { useState, useEffect } from 'react';
import { apiService, Project, ProjectsResponse } from '../services/apiService';
import ProjectCard from './ProjectCard';

interface ProjectSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProjectSidebar({ isOpen, onToggle }: ProjectSidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ProjectsResponse = await apiService.fetchProjects();
      // Sort projects by most recent first
      const sortedProjects = response.data.projects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(sortedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(selectedProject?.projectId === project.projectId ? null : project);
  };

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-700 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchProjects}
              disabled={loading}
              className="p-1 hover:bg-slate-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh projects"
            >
              <svg className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Projects List Section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Projects List Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                {projects.length} projects
              </span>
              {totalPages > 1 && (
                <span className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {/* Projects List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={fetchProjects}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No projects found
                </div>
              ) : (
                <div className="space-y-3">
                  {currentProjects.map((project) => (
                    <ProjectCard
                      key={project.projectId}
                      project={project}
                      isSelected={selectedProject?.projectId === project.projectId}
                      onSelect={handleProjectSelect}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-700 flex items-center justify-between">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-slate-800 text-slate-300 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 text-sm rounded transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-slate-800 text-slate-300 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Selected Project Details - Always visible at bottom */}
          {selectedProject && (
            <div className="border-t border-slate-700 p-4 bg-slate-800/50">
              <h3 className="font-semibold text-white mb-2">Project Details</h3>
              <div className="space-y-2 text-sm">
              <div>
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white ml-2 font-mono text-xs">{selectedProject.projectName}</span>
                </div>
                <div>
                  <span className="text-slate-400">ID:</span>
                  <span className="text-white ml-2 font-mono text-xs">{selectedProject.projectId}</span>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <span className="text-white ml-2">{selectedProject.status}</span>
                </div>
              </div>

              {/* Action Links */}
              {selectedProject.assets && (
                <div className="mt-3 space-y-2">
                  {selectedProject.assets.websiteUrl && (
                    <a
                      href={selectedProject.assets.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Website
                    </a>
                  )}
                  {selectedProject.assets.previewUrl && (
                    <a
                      href={selectedProject.assets.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Chat History
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 