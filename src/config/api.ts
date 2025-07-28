// ai-agent-frontend/src/config/api.ts
export const API_CONFIG = {
  // Default to localhost for development
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/dev',
  
  // Request timeout - increased for AI processing
  TIMEOUT: 120000, // 2 minutes for individual requests
  
  // Polling interval for deployment status
  POLL_INTERVAL: 5000, // Poll every 5 seconds instead of 3
};

export const API_ENDPOINTS = {
  PROJECTS: '/projects',
  PROJECT: (projectId: string) => `/projects/${projectId}`,
  DEPLOYMENTS: (projectId: string) => `/projects/${projectId}/deployments`,
  DEPLOYMENT_STATUS: (projectId: string, deploymentId: string) => 
    `/projects/${projectId}/deployments/${deploymentId}`,
  DOMAIN: '/domain',
}; 