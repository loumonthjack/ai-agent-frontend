import { API_CONFIG, API_ENDPOINTS } from '../config/api';

export interface CreateProjectRequest {
  projectName: string;
  description?: string;
  prompt: string;
  userEmail?: string;
  businessDetails?: {
    businessName?: string;
    industry?: string;
    targetAudience?: string;
    domainName?: string;
    tone?: 'professional' | 'casual' | 'modern' | 'elegant' | 'playful' | 'corporate' | 'creative' | 'minimalist';
    colorPreference?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'neutral' | 'dark' | 'colorful' | 'minimal' | 'rgb';
    customColor?: string;
    features?: string[];
    // New design options
    fontFamily?: 'sans-serif' | 'serif' | 'display' | 'handwritten' | 'monospace' | 'custom';
    layoutStyle?: 'centered' | 'full-width' | 'sidebar-left' | 'sidebar-right' | 'asymmetric' | 'magazine';
    headerStyle?: 'fixed' | 'transparent' | 'solid' | 'minimal' | 'bold' | 'classic';
    buttonStyle?: 'rounded' | 'square' | 'pill' | 'ghost' | 'gradient' | '3d';
    animationLevel?: 'none' | 'subtle' | 'moderate' | 'rich';
    typographyScale?: 'small' | 'medium' | 'large' | 'extra-large';
    spacing?: 'compact' | 'normal' | 'spacious' | 'airy';
    sectionStyle?: 'flat' | 'cards' | 'waves' | 'geometric' | 'gradient' | 'parallax';
  };
}

export interface Project {
  id: string;
  projectId: string;
  projectName: string;
  description?: string;
  prompt: string;
  userEmail?: string;
  status: 'PROCESSING' | 'BUILDING' | 'DESIGN' | 'TESTING' | 'DEPLOYING' | 'ACTIVE' | 'FAILED' | 'READY';
  createdAt: string;
  updatedAt: string;
  executionArn?: string;
  websiteUrl?: string;
  previewUrl?: string;
  deploymentUrl?: string;
  demo?: string;
  url?: string;
  assets?: {
    websiteUrl?: string;
    previewUrl?: string;
    deploymentUrl?: string;
  };
}

export interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
    total: number;
  };
  timestamp: string;
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
  buildDetails?: {
    websiteUrl?: string;
    buildLog?: string;
  };
  error?: string;
}

export interface DomainAvailabilityResponse {
  domain: string;
  available: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Debug logging
    console.log('API Request:', {
      method: options.method || 'GET',
      url,
      baseUrl: this.baseUrl,
      endpoint
    });
    
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

      console.log('API Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('API Error Details:', {
          url,
          status: response.status,
          statusText: response.statusText,
          errorBody: error
        });
        throw new Error(`API Error (${response.status}): ${error}`);
      }

      const result = await response.json();
      console.log('API Success:', {
        url,
        dataKeys: result && typeof result === 'object' ? Object.keys(result) : 'not-object'
      });
      
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error('API Request Failed:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : typeof error
      });
      
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
   * Create project without waiting for full response - returns immediately
   */
  async createProjectNonBlocking(request: CreateProjectRequest): Promise<void> {
    await this.request<{success: boolean}>(API_ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: JSON.stringify({...request, userEmail: 'me@loumonthjack.com'}),
    });
  }

  /**
   * Find the most recently created project (likely the one we just created)
   */
  async findLatestProject(): Promise<Project | null> {
    try {
      const response = await this.fetchProjects();
      if (response.data.projects.length > 0) {
        // Sort by creation date and return the most recent
        const sortedProjects = response.data.projects.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return sortedProjects[0];
      }
      return null;
    } catch (error) {
      console.error('Error finding latest project:', error);
      return null;
    }
  }

  /**
   * Find projects created within the last few minutes
   */
  async findRecentProjects(minutes: number = 2): Promise<Project[]> {
    try {
      const response = await this.fetchProjects();
      const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
      
      return response.data.projects.filter(project => 
        new Date(project.createdAt) > cutoffTime
      ).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error finding recent projects:', error);
      return [];
    }
  }

  /**
   * Get project status - can be used to check if AI generation is complete
   */
  async getProject(projectId: string): Promise<Project> {
    const response = await this.request<{success: boolean; data: Project}>(API_ENDPOINTS.PROJECT(projectId));
    
    return response.data;
  }

  /**
   * Poll project status until AI generation is complete
   */
  async waitForProjectReady(projectId: string, onProgress?: (status: string) => void): Promise<Project> {
    let attempts = 0;
    const maxAttempts = 120; // 5 minutes with 5-second intervals

    while (attempts < maxAttempts) {
      try {
        const project = await this.getProject(projectId);
        
        if (onProgress) {
          onProgress(project.status);
        }

        // Check if project is ready for deployment
        if (['DESIGN', 'ACTIVE', 'READY'].includes(project.status)) {
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

  /**
   * Fetch all projects
   */
  async fetchProjects(): Promise<ProjectsResponse> {
    const response = await this.request<ProjectsResponse>(API_ENDPOINTS.PROJECTS);
    return response;
  }

  /**
   * Check domain availability
   */
  async checkDomainAvailability(domain: string): Promise<DomainAvailabilityResponse> {
    const response = await this.request<{success: boolean; data: DomainAvailabilityResponse}>(API_ENDPOINTS.DOMAIN, {
      method: 'POST',
      body: JSON.stringify({ domain }),
    });
    
    return response.data;
  }
}

export const apiService = new ApiService(); 