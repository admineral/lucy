# Lucy - Local AI Chat Interface

## Overview

Lucy is a modern, privacy-focused chat interface that runs entirely on your local machine using LM Studio. Built with Next.js 15, it provides a seamless experience for interacting with large language models without sending your data to external servers.

### Key Features

- **Complete Privacy**: All conversations stay on your machine
- **Real-time Streaming**: Live responses with thinking process visualization  
- **Model Management**: Load, unload, and switch between different LLMs
- **Modern Interface**: Responsive design with smooth animations
- **TypeScript**: Full type safety throughout the application

---

## Quick Start Guide

> **For Beginners**: Follow these steps to get Lucy running in 5 minutes

### Step 1: Install LM Studio

1. Download LM Studio from [lmstudio.ai](https://lmstudio.ai)
2. Install and launch the application
3. In LM Studio, go to the "Local Server" tab and start the server
4. The server should run on `http://localhost:1234`

### Step 2: Download a Model

In LM Studio's search tab, download one of these available models:

```bash
# Lightweight and fast (recommended for most users)
qwen3-4b                    # 2.12 GB - Best for limited RAM

# Balanced performance
qwen3-8b                    # 4.31 GB - Good balance of speed and quality

# High quality reasoning
qwen3-14b                   # 14.63 GB - Excellent reasoning capabilities
qwq-32b                     # 17.18 GB - Advanced reasoning model
qwen3-32b                   # 17.18 GB - Highest quality responses

# Specialized models
deepseek-r1-0528-qwen3-8b   # 8.12 GB - DeepSeek reasoning variant
qwen3-30b-a3b               # 16.01 GB - Optimized 30B variant
```

Load the model in LM Studio's chat tab.

**Model Selection Guide:**
- **8GB RAM or less**: Use `qwen3-4b`
- **16GB RAM**: Use `qwen3-8b` or `deepseek-r1-0528-qwen3-8b`
- **32GB RAM or more**: Use `qwen3-14b`, `qwq-32b`, or `qwen3-32b` for best quality

### Step 3: Setup Lucy

```bash
# Clone the repository
git clone <your-repo-url>
cd lucy

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Step 4: Start Chatting

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Select your loaded model from the sidebar
3. Start chatting with your local AI!

---

## Project Architecture

> **For Advanced Users**: Deep dive into the codebase structure

### Core Technologies

- **Next.js 15**: App Router with server components and API routes
- **TypeScript**: Full type safety across the entire codebase
- **React 18**: Modern hooks, contexts, and concurrent features
- **Tailwind CSS**: Utility-first styling with custom design system
- **Server-Sent Events**: Real-time streaming communication

### Directory Structure

```
lucy/
├── app/
│   ├── api/                    # API Routes
│   │   ├── chat/route.ts      # Streaming chat endpoint
│   │   └── models/route.ts    # Model management API
│   ├── components/            # React Components
│   │   ├── chat/             # Chat-specific components
│   │   ├── models/           # Model management UI
│   │   └── layout/           # Layout components
│   ├── contexts/             # React Context Providers
│   │   ├── ChatContext.tsx   # Chat state management
│   │   ├── ModelContext.tsx  # Model state management
│   │   └── UIContext.tsx     # UI state management
│   ├── hooks/                # Custom React Hooks
│   ├── services/             # Business Logic Layer
│   │   ├── chatService.ts    # Chat API communication
│   │   └── modelService.ts   # Model API communication
│   ├── types/                # TypeScript Definitions
│   │   ├── chat.ts          # Chat-related types
│   │   ├── models.ts        # Model-related types
│   │   └── streaming.ts     # Streaming types
│   └── utils/                # Utility Functions
│       ├── streamParser.ts   # SSE parsing utilities
│       ├── modelHelpers.ts   # Model utility functions
│       └── formatters.ts     # Data formatting utilities
└── components/ui/            # Reusable UI Components
```

### Application Flow

#### 1. Context Architecture

The application uses three main contexts for state management:

- **ModelContext**: Manages available models, loading states, and model selection
- **ChatContext**: Handles message history, streaming responses, and chat operations  
- **UIContext**: Controls sidebar visibility and responsive behavior

#### 2. Streaming Implementation

```typescript
// Server-Sent Events flow
Client Request → API Route → LM Studio → SSE Stream → React State Updates
```

**Stream Event Types:**
- `thinking_partial`: Incremental thinking process updates
- `thinking`: Complete thinking content
- `response`: Incremental response content  
- `complete`: Final response with full content
- `error`: Error states with suggestions

#### 3. Model Management

**Model States:**
- `available`: Models downloaded but not loaded
- `loaded`: Models ready for inference
- `loading`: Models currently being loaded

**Operations:**
```typescript
// Load a model
await modelService.loadModel('qwen3-8b');

// Switch active model
modelContext.selectModel('qwen3-14b');

// Unload to free memory
await modelService.unloadModel('qwen3-4b');
```

### API Endpoints

#### Chat API (`/api/chat`)

**Request:**
```typescript
interface ChatRequest {
  message: string;
  model: string;
  chatHistory: ChatHistoryItem[];
}
```

**Response:** Server-Sent Events stream
```
data: {"type": "thinking_partial", "content": "Let me think..."}
data: {"type": "response", "content": "Hello! How can I help?"}
data: {"type": "complete", "fullContent": "Hello! How can I help?", "timestamp": "..."}
```

#### Models API (`/api/models`)

**GET Response:**
```typescript
interface ModelsResponse {
  loaded: Model[];
  available: Model[];
  timestamp: string;
}
```

**POST Request:**
```typescript
interface ModelActionRequest {
  action: 'load' | 'unload';
  modelIdentifier: string;
}
```

### Key Components

#### ChatContainer
Main chat interface orchestrating message display and input handling.

#### MessageList  
Renders message history with support for streaming updates and thinking visualization.

#### ModelSidebar
Displays available models with loading states and management controls.

#### StreamParser Utilities
Handles Server-Sent Events parsing and event type differentiation.

### Service Layer

#### chatService.ts
- Manages HTTP communication with chat API
- Handles SSE stream parsing and event dispatching
- Provides request validation and error handling

#### modelService.ts  
- Interfaces with model management API
- Handles model loading/unloading operations
- Provides model metadata and status information

### Type System

The application maintains strict TypeScript definitions across:

- **Chat Types**: Messages, history, and request/response structures
- **Model Types**: Model metadata, states, and API interfaces  
- **Streaming Types**: SSE events and parsing results

### Error Handling

Multi-layered error handling approach:

1. **Service Level**: HTTP errors and network issues
2. **Stream Level**: SSE parsing and connection errors
3. **Component Level**: UI error states and user feedback
4. **Context Level**: Global error state management

### Performance Optimizations

- **Stream Processing**: Efficient SSE parsing with buffer management
- **Context Optimization**: Minimized re-renders through selective context updates
- **Component Memoization**: Strategic use of React.memo and useMemo
- **Abort Controllers**: Proper cleanup of streaming requests

---

## Development

### Prerequisites

- Node.js 18+ 
- LM Studio Desktop Application
- TypeScript knowledge for advanced customization

### Environment Setup

1. Ensure LM Studio server is running on `http://localhost:1234`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access at `http://localhost:3000`

### Customization

The modular architecture allows easy customization:

- **UI Components**: Modify components in `/components/ui/`
- **Chat Logic**: Extend services in `/app/services/`
- **State Management**: Add new contexts in `/app/contexts/`
- **API Integration**: Modify routes in `/app/api/`

### Building for Production

```bash
npm run build
npm start
```

---

## Troubleshooting

### Common Issues

**"Cannot connect to LM Studio"**
- Verify LM Studio is running and server is enabled
- Check server URL in network settings
- Ensure no firewall blocking localhost:1234

**"Model not available"**  
- Download model through LM Studio interface
- Load model in LM Studio chat tab
- Refresh model list in Lucy interface

**Slow streaming responses**
- Use smaller models (start with qwen3-4b, then try qwen3-8b)
- Close other applications to free RAM
- Check CPU usage and system resources

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with Next.js 15 and LM Studio for privacy-focused AI conversations**
