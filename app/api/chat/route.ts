import { LMStudioClient, Chat } from "@lmstudio/sdk";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, model, chatHistory = [] } = await request.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Initialize LM Studio client
    const client = new LMStudioClient();

    // Get the model
    const llmModel = await client.llm.model(model);

    // Create chat context from history
    const chat = Chat.empty();
    
    // Add chat history to context
    for (const msg of chatHistory) {
      chat.append(msg.role, msg.content);
    }
    
    // Add current user message
    chat.append("user", message);

    // Create a readable stream for server-sent events
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate streaming response with chat context
          const prediction = llmModel.respond(chat);

          let thinkingContent = '';
          let isInThinking = false;
          let currentThinkingBuffer = '';
          let responseContent = '';

          for await (const { content } of prediction) {
            // Check for thinking tokens
            if (content.includes('<think>')) {
              isInThinking = true;
              const thinkStart = content.indexOf('<think>');
              if (thinkStart >= 0) {
                currentThinkingBuffer += content.substring(thinkStart + 7);
              }
            } else if (content.includes('</think>')) {
              isInThinking = false;
              const thinkEnd = content.indexOf('</think>');
              if (thinkEnd >= 0) {
                currentThinkingBuffer += content.substring(0, thinkEnd);
                thinkingContent = currentThinkingBuffer;
                
                // Send thinking content immediately
                const thinkingData = JSON.stringify({
                  type: 'thinking',
                  content: thinkingContent,
                  timestamp: new Date().toISOString()
                });
                controller.enqueue(encoder.encode(`data: ${thinkingData}\n\n`));
                
                // Reset thinking buffer and start collecting response
                currentThinkingBuffer = '';
                responseContent += content.substring(thinkEnd + 8);
              }
            } else if (isInThinking) {
              currentThinkingBuffer += content;
              
              // Send partial thinking content for real-time display
              const partialThinkingData = JSON.stringify({
                type: 'thinking_partial',
                content: currentThinkingBuffer,
                timestamp: new Date().toISOString()
              });
              controller.enqueue(encoder.encode(`data: ${partialThinkingData}\n\n`));
            } else {
              // Regular response content
              responseContent += content;
              
              // Send streaming response content
              const responseData = JSON.stringify({
                type: 'response',
                content: content,
                timestamp: new Date().toISOString()
              });
              controller.enqueue(encoder.encode(`data: ${responseData}\n\n`));
            }
          }

          // Send completion signal
          const completeData = JSON.stringify({
            type: 'complete',
            model: model,
            fullContent: responseContent,
            thinkingContent: thinkingContent,
            timestamp: new Date().toISOString()
          });
          controller.enqueue(encoder.encode(`data: ${completeData}\n\n`));
          
        } catch (error) {
          console.error("Error in streaming chat:", error);
          
          let errorMessage = "Internal server error";
          let suggestion = "";
          
          if (error instanceof Error) {
            if (error.message.includes("model not found") || error.message.includes("not loaded")) {
              errorMessage = "Model not available. Please ensure LM Studio is running and the model is loaded.";
              suggestion = "Load the model first using the model panel";
            } else if (error.message.includes("connection refused") || error.message.includes("ECONNREFUSED")) {
              errorMessage = "Cannot connect to LM Studio. Please ensure LM Studio is running.";
              suggestion = "Start LM Studio desktop app and enable the local server";
            }
          }

          const errorData = JSON.stringify({
            type: 'error',
            error: errorMessage,
            suggestion: suggestion,
            timestamp: new Date().toISOString()
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
} 