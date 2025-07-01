# Next.js 15 + LM Studio Integration

A modern chat interface powered by local LLMs running through LM Studio. Experience the power of AI without sending your data to the cloud.

## Features

- 🔒 **Local & Private**: Your conversations stay on your machine
- ⚡ **Fast & Efficient**: Optimized for local inference
- 🤖 **Multiple Models**: Switch between different LLMs
- 🎛️ **Model Management**: Load and unload models dynamically
- 💬 **Real-time Chat**: Interactive chat interface
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Prerequisites

1. **LM Studio Desktop App**
   - Download from [lmstudio.ai](https://lmstudio.ai)
   - Install and run the application
   - Enable the local server (usually runs on `http://localhost:1234`)

2. **Node.js** (v18 or higher)

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo>
   cd lucy
   npm install
   ```

2. **Download a model** (choose one):
   ```bash
   # Using LM Studio CLI
   lms get llama-3.2-1b-instruct
   
   # Or download through LM Studio GUI
   # Search for "llama-3.2-1b-instruct" in the app
   ```

3. **Start LM Studio**:
   - Open LM Studio desktop app
   - Load your downloaded model
   - Enable the local server in settings

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Start chatting with your local LLM!

## Available Models

The application supports various models. Popular choices include:

- `llama-3.2-1b-instruct` (Lightweight, fast)
- `llama-3.2-3b-instruct` (Balanced performance)
- `phi-3.5-mini-instruct` (Microsoft's efficient model)
- `qwen2.5-0.5b-instruct` (Very lightweight)

## Project Structure

```
lucy/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Chat API endpoint
│   │   └── models/route.ts        # Model management API
│   ├── components/
│   │   ├── ChatInterface.tsx      # Chat UI component
│   │   ├── ModelManager.tsx       # Model management UI
│   │   └── TabNavigation.tsx      # Navigation component
│   ├── layout.tsx
│   └── page.tsx                   # Main page
├── package.json
└── README.md
```

## API Endpoints

### Chat API (`/api/chat`)
- **POST**: Send messages to the LLM
- **Body**: `{ message: string, model?: string }`
- **Response**: `{ response: string, model: string, timestamp: string }`

### Models API (`/api/models`)
- **GET**: List loaded and available models
- **POST**: Load or unload models
  - **Body**: `{ action: 'load' | 'unload', modelIdentifier: string }`

## Usage Examples

### Basic Chat
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello, how are you?',
    model: 'llama-3.2-1b-instruct'
  })
});
```

### Model Management
```typescript
// Load a model
await fetch('/api/models', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'load',
    modelIdentifier: 'llama-3.2-1b-instruct'
  })
});
```

## Troubleshooting

### Common Issues

1. **"Cannot connect to LM Studio"**
   - Ensure LM Studio desktop app is running
   - Check that the local server is enabled
   - Verify the server is running on `http://localhost:1234`

2. **"Model not available"**
   - Make sure the model is downloaded and loaded in LM Studio
   - Try running: `lms get llama-3.2-1b-instruct`

3. **Slow responses**
   - Consider using a smaller model (e.g., 1B instead of 7B)
   - Check your system resources (RAM, CPU)

### Performance Tips

- **RAM**: Ensure you have enough RAM for your chosen model
- **CPU**: Better CPUs will provide faster inference
- **Model Size**: Start with smaller models (1B-3B parameters) for better performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Resources

- [LM Studio Documentation](https://lmstudio.ai/docs)
- [LM Studio TypeScript SDK](https://lmstudio.ai/docs/typescript)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

Built with ❤️ using Next.js 15 and LM Studio
