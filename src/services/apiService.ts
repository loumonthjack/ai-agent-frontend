import { API_CONFIG, API_ENDPOINTS } from '../config/api';

export interface CreateProjectRequest {
  projectName: string;
  description?: string;
  prompt: string;
  userEmail?: string;
}

export interface Project {
  id: string;
  projectId: string;
  projectName: string;
  description?: string;
  prompt: string;
  userEmail?: string;
  status: 'BUILDING' | 'DESIGN' | 'TESTING' | 'DEPLOYING' | 'ACTIVE' | 'FAILED' | 'READY';
  createdAt: string;
  executionArn?: string;
  websiteUrl?: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  createdAt: string;
}

export interface DeploymentStatus {
  id: string;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  steps: {
    generateCode: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    runTests: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    deployFrontend: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    deployBackend: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  };
  outputs?: {
    frontendUrl?: string;
    backendUrl?: string;
  };
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error (${response.status}): ${error}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${API_CONFIG.TIMEOUT}ms`);
      }
      
      throw error;
    }
  }

  async createProject(request: CreateProjectRequest): Promise<Project> {
    const response = await this.request<{success: boolean; data: Project}>(API_ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: JSON.stringify({...request, userEmail: 'me@loumonthjack.com'}),
    });
    
    return response.data;
  }

  /**
   * Get project status - can be used to check if AI generation is complete
   */
  async getProject(projectId: string): Promise<Project> {
    const response = await this.request<{success: boolean; data: Project}>(
      `${API_ENDPOINTS.PROJECTS}/${projectId}`
    );
    
    return response.data;
  }

  /**
   * Create deployment - only called after project AI generation is complete
   */
  async createDeployment(projectId: string, request: unknown = {}): Promise<Deployment> {
    const response = await this.request<{success: boolean; data: Deployment}>(API_ENDPOINTS.DEPLOYMENTS(projectId), {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    return response.data;
  }

  async getDeploymentStatus(projectId: string, deploymentId: string): Promise<DeploymentStatus> {
    const response = await this.request<{success: boolean; data: DeploymentStatus}>(
      API_ENDPOINTS.DEPLOYMENT_STATUS(projectId, deploymentId)
    );
    
    return response.data;
  }

  /**
   * Poll project status until AI generation is complete
   */
  async waitForProjectReady(projectId: string, onProgress?: (status: string) => void): Promise<Project> {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    while (attempts < maxAttempts) {
      try {
        const project = await this.getProject(projectId);
        
        if (onProgress) {
          onProgress(project.status);
        }

        // Check if project is ready for deployment
        if (project.status === 'DESIGN' || project.status === 'ACTIVE' || project.status === 'READY') {
          return project;
        }

        // Check if project failed
        if (project.status === 'FAILED') {
          throw new Error('Project generation failed');
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.POLL_INTERVAL));
        attempts++;
        
      } catch (error) {
        console.error('Error polling project status:', error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw new Error('Timeout waiting for project to be ready');
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.POLL_INTERVAL));
      }
    }

    throw new Error('Timeout waiting for project to be ready');
  }
}

export const apiService = new ApiService(); 