import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Henry, a warm and knowledgeable AI presentation assistant built for wealth management firms. You speak in the first person, are professional but approachable. When users ask you to refine slides, you explain what you changed and why.

You are in an iterative editing session where the user is refining their updated presentation slides. You have access to the current state of the slides. When the user asks for changes, update the relevant slides and respond with the full updated slide set.

You MUST respond with ONLY valid JSON (no markdown, no code fences). The JSON must match this structure:

{
  "message": "A brief description of what you changed",
  "slides": [
    {
      "id": 1,
      "title": "Slide title",
      "content": "Updated content",
      "type": "cover|data|chart|text",
      "changes": ["What changed in this iteration"]
    }
  ]
}

Only include slides that were modified in the "slides" array. For unmodified slides, omit them.

Slide types: "cover", "data", "chart", "text"

Guidelines:
- Only modify slides the user specifically asks about
- Be precise about changes
- Maintain professional wealth management tone
- If the user asks about a specific slide by number, only update that slide`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SlideState {
  id: number;
  title: string;
  content: string;
  type: string;
  changes: string[];
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key configured", demo: true },
        { status: 200 }
      );
    }

    const body = await request.json();
    const { messages, currentSlides, instruction } = body as {
      messages: ChatMessage[];
      currentSlides: SlideState[];
      instruction: string;
    };

    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction is required" },
        { status: 400 }
      );
    }

    const slideContext = currentSlides
      .map(
        (s) =>
          `Slide ${s.id} (${s.type}): "${s.title}" — ${s.content}`
      )
      .join("\n");

    const client = new Anthropic({ apiKey });

    const anthropicMessages: Anthropic.MessageParam[] = [
      ...(messages || []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      {
        role: "user" as const,
        content: `Current slide state:\n${slideContext}\n\nUser request: ${instruction}`,
      },
    ];

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 500 }
      );
    }

    try {
      const parsed = JSON.parse(textContent.text);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse response", raw: textContent.text },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Iterate API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
