import { LMStudioClient } from "@lmstudio/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = new LMStudioClient();
    
    // Get loaded models
    const loadedModels = await client.llm.listLoaded();
    
    // Get available models (downloaded but not loaded)
    const availableModels = await client.system.listDownloadedModels();

    return NextResponse.json({
      loaded: loadedModels.map(model => ({
        identifier: model.identifier,
        path: model.path || '',
        size: 0, // Size not available in loaded models
      })),
      available: availableModels.map(model => ({
        identifier: model.path, // Use path as identifier for available models
        path: model.path,
        size: model.sizeBytes || 0,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("connection refused") || error.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { 
            error: "Cannot connect to LM Studio. Please ensure LM Studio is running.",
            suggestion: "Start LM Studio desktop app and enable the local server"
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, modelIdentifier } = await request.json();
    const client = new LMStudioClient();

    if (action === "load") {
      if (!modelIdentifier) {
        return NextResponse.json(
          { error: "Model identifier is required for loading" },
          { status: 400 }
        );
      }

      await client.llm.load(modelIdentifier);
      
      return NextResponse.json({
        success: true,
        message: `Model ${modelIdentifier} loaded successfully`,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "unload") {
      if (!modelIdentifier) {
        return NextResponse.json(
          { error: "Model identifier is required for unloading" },
          { status: 400 }
        );
      }

      await client.llm.unload(modelIdentifier);
      
      return NextResponse.json({
        success: true,
        message: `Model ${modelIdentifier} unloaded successfully`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'load' or 'unload'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error managing model:", error);
    
    return NextResponse.json(
      { error: "Failed to manage model" },
      { status: 500 }
    );
  }
} 