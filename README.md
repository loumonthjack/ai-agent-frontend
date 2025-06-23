# AI Agent Frontend

A modern React frontend for the AI Agent application that allows users to generate full-stack applications through natural language prompts.

## Features

- 🤖 **AI-Powered**: Generate complete applications using natural language
- ⚡ **Real-time Building**: Interactive progress tracking during build process
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔄 **Live Updates**: Real-time status updates during deployment

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Backend API URL
VITE_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/stage

# For local development with backend
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

## Backend Integration

This frontend connects to the AI Agent serverless backend. Make sure to:

1. Deploy the backend first (see `../ai-agent/README.md`)
2. Update `VITE_API_URL` with your API Gateway URL
3. Ensure CORS is configured properly in your backend

## Project Structure

```
src/
├── components/         # React components
│   ├── BuildingPhase.tsx  # Interactive build progress
│   ├── HeroSection.tsx    # Main input interface
│   └── ...
├── services/          # API services
│   └── apiService.ts     # Backend API integration
├── config/           # Configuration
│   └── api.ts           # API configuration
└── styles/           # Styling
```

## Usage

1. **Describe Your App**: Enter a detailed description of your application idea (minimum 50 characters, maximum 2000)
2. **Submit**: Press Enter or click the arrow button to start building
3. **Watch Progress**: Interactive progress screen shows real-time build status:
   - 🤖 **Generating Code**: AI creates your application
   - 🧪 **Running Tests**: Validates code quality
   - 🌐 **Deploy Frontend**: Sets up your frontend
   - ⚙️ **Deploy Backend**: Configures your backend
4. **Access Your App**: Get direct links to your deployed application when complete

### Input Requirements

- **Minimum**: 50 characters for detailed requirements
- **Maximum**: 2000 characters
- **Auto-Generated**: Project name is automatically created from your description
- **Validation**: Real-time character counter and validation feedback

## Technologies

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **ESLint** for code quality # ai-agent-frontend
# ai-agent-frontend
# ai-agent-frontend
