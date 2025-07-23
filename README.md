# 🎨 AI Website Builder Frontend - V0 Powered

A modern React frontend that creates custom websites through **V0.dev** AI-powered generation. Features a split-screen interface with prompt input on the left and live V0 preview on the right.

## ✨ Features

- 🤖 **V0.dev Integration**: Generate unique websites using V0's advanced AI
- 🎨 **Split-Screen Interface**: Prompt left, live preview right
- 📋 **Comprehensive Input**: Business details, design preferences, and features
- ⚡ **Real-time Preview**: Instant V0 preview URLs
- 🌐 **Instant Deployment**: Get live website URLs immediately
- 📱 **Responsive Design**: Perfect on all devices
- 🎛️ **Advanced Controls**: Typography, layouts, animations, and more

## 🏗️ Architecture

### V0 Integration Flow
```
Business Input → V0 Generation → Live Preview → Deployment → Website URL
```

### Split-Screen Layout
- **Left Panel**: 
  - Business information form
  - Design customization options
  - Advanced settings
  - Project summary

- **Right Panel**:
  - Live V0 preview iframe
  - Generation status
  - Preview and deployment URLs
  - Website controls

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS with modern UI components
- **Icons**: Lucide React
- **API**: RESTful communication with V0 backend
- **State**: React Hooks for local state management

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create `.env.local`:
```bash
# Backend API URL (after backend deployment)
VITE_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/stage

# For local development
# VITE_API_URL=http://localhost:3000/dev
```

### 3. Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 User Interface

### Main Form (Left Panel)

#### Required Fields
- **Business Name**: Company/organization name
- **Industry**: Choose from 16+ categories including:
  - Technology & Software
  - Healthcare & Medical  
  - Professional Services
  - E-commerce & Retail
  - Education & Training
  - Real Estate
  - And many more...

- **Website Description**: Detailed requirements (50-2000 characters)
  - Business goals and objectives
  - Target audience description
  - Key features and functionality
  - Content and messaging preferences

#### Design Customization
- **Tone & Style**: 8 design approaches
  - Professional, Modern, Creative
  - Elegant, Playful, Corporate
  - Minimalist, Casual

- **Color Schemes**: 9 curated options
  - Blue (Professional)
  - Green (Growth-focused)
  - Purple (Creative)
  - Orange (Energetic)
  - Red (Bold)
  - Neutral (Classic)
  - Dark (Modern)
  - Colorful (Vibrant)
  - Minimal (Clean)

#### Advanced Design Options
- **Typography**:
  - Font families (Sans-serif, Serif, Display, etc.)
  - Text scale (Small, Medium, Large, Extra Large)

- **Layout Styles**:
  - Centered, Full-width, Sidebar layouts
  - Asymmetric, Magazine-style

- **Component Styles**:
  - Header types (Fixed, Transparent, Solid)
  - Button styles (Rounded, Square, Pill-shaped)
  - Animation levels (None, Subtle, Moderate, Bold)

#### Feature Selection
Choose from 16+ website features:
- 📞 Contact Forms
- 📧 Newsletter Signup
- 🛒 E-commerce Integration
- 📱 Social Media Links
- 📊 Analytics Integration
- 🗓️ Event Calendar
- 👥 Team/Staff Pages
- 📝 Blog/News Section
- 🖼️ Photo Gallery
- 📹 Video Integration
- 💬 Live Chat
- 🔍 Search Functionality
- 📱 Mobile App Links
- 💳 Payment Processing
- 📈 Customer Reviews
- 🎨 Portfolio Showcase

### V0 Preview (Right Panel)

#### Generation Status
- **Building**: V0 creating your custom website
- **Ready**: Website generated and preview available
- **Failed**: Error occurred with retry option

#### Preview Features
- **Live Preview**: Embedded V0 preview iframe
- **Preview URL**: Direct link to V0 preview
- **Deployment URL**: Live website URL when ready
- **Controls**: Refresh, external view, reset options

#### Project Summary
- Business details recap
- Selected design options
- Chosen features
- Generation timestamp

## 🔧 API Integration

### Backend Communication
```typescript
// Create V0 website project
const response = await apiService.createProject({
  projectName: "My Business",
  description: "Professional website",
  prompt: "Create a modern business website...",
});

// Get project status and URLs
const project = await apiService.getProject(projectId);
console.log(project.v0ProjectData.previewUrl);
```

### V0 Response Handling
```typescript
interface V0ProjectData {
  v0ProjectId: string;
  previewUrl?: string;
  deploymentUrl?: string;
  status: 'creating' | 'building' | 'ready' | 'error';
}
```

## 🎯 User Experience Flow

### 1. Initial Setup
1. User fills out business information
2. Selects design preferences
3. Chooses website features
4. Provides detailed description

### 2. V0 Generation
1. Form validation and submission
2. Split-screen view activates
3. V0 generation begins
4. Real-time status updates

### 3. Preview & Deploy
1. V0 preview appears in right panel
2. User can view live preview
3. Deployment happens automatically
4. Final website URL provided

### 4. Project Management
1. Project details displayed
2. URLs for preview and live site
3. Option to create new project
4. Error handling and retry

## 📱 Responsive Design

### Mobile Layout
- **Stacked Layout**: Form above, preview below
- **Collapsible Sections**: Advanced options fold away
- **Touch-Friendly**: Large buttons and inputs
- **Optimized Performance**: Efficient rendering

### Tablet Layout
- **Adaptive Split**: Adjusts split ratio
- **Touch & Mouse**: Supports both interactions
- **Landscape/Portrait**: Responsive to orientation

### Desktop Layout
- **50/50 Split**: Optimal workspace division
- **Keyboard Navigation**: Full keyboard support
- **Multiple Monitors**: Scales beautifully

## 🛡️ Error Handling

### V0 API Errors
- Network connectivity issues
- Rate limiting responses  
- Generation failures
- Invalid input validation

### User Experience
- Clear error messages
- Retry mechanisms
- Fallback options
- Progress indicators

## 🧪 Development

### Project Structure
```
src/
├── components/
│   ├── HeroSection.tsx     # Main split-screen interface
│   ├── V0Preview.tsx       # V0 preview panel
│   ├── Header.tsx          # App header
│   └── Footer.tsx          # App footer
├── services/
│   └── apiService.ts       # Backend API integration
├── config/
│   └── api.ts             # API configuration
└── App.tsx                # Main app component
```

### Key Components

#### HeroSection.tsx
- Main application interface
- Form handling and validation
- Split-screen layout management
- V0 integration orchestration

#### V0Preview.tsx
- Live V0 preview display
- Status monitoring
- URL management
- Error handling

### Build Configuration
```json
{
  "build": "vite build",
  "preview": "vite preview",
  "dev": "vite --port 3000"
}
```

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect to Git repository
- **AWS S3**: Upload build artifacts
- **GitHub Pages**: Configure Actions

### Environment Variables
Set in hosting platform:
```bash
VITE_API_URL=https://your-backend-api-url.com
```

## 📈 Performance

### Optimizations
- **Code Splitting**: Dynamic imports for features
- **Image Optimization**: Lazy loading and WebP
- **Bundle Analysis**: Tree shaking unused code
- **Caching**: Service worker for offline support

### Metrics
- **First Paint**: < 1.5s
- **Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped
- **Lighthouse Score**: 90+ across all metrics

## 🎨 Customization

### Theming
```css
/* Tailwind CSS custom variables */
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --accent: #06b6d4;
}
```

### Component Extension
```tsx
// Extend existing components
const CustomHeroSection = () => {
  return (
    <HeroSection>
      <CustomFeature />
    </HeroSection>
  );
};
```

## 📄 Generated Websites

### V0 Output Features
- **Modern Design**: Contemporary UI patterns
- **Responsive Layout**: Mobile-first approach
- **Performance**: Optimized loading and rendering
- **Accessibility**: WCAG compliant structure
- **SEO Ready**: Semantic HTML and meta tags

### Technology Stack
- **Framework**: React with Next.js
- **Styling**: Tailwind CSS
- **Components**: Modern UI library
- **Icons**: Lucide React
- **Fonts**: Google Fonts integration

## 🆘 Support

### Documentation
- Component API documentation
- Integration guides
- Troubleshooting guides

### Community
- GitHub Issues for bug reports
- Feature requests and enhancements
- Community discussions

---

**Create stunning websites with the power of V0.dev AI! 🚀**
