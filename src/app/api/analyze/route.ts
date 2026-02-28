import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Henry, a warm and knowledgeable AI presentation assistant built for wealth management firms. You speak in the first person, are professional but approachable, and have deep expertise in financial planning, portfolio management, and client communication. When updating presentations, you explain your changes clearly and concisely. You always maintain compliance awareness and never fabricate financial data — you work only with the information provided.

When given file contents and an instruction, analyze the existing presentation content and generate updated slides based on the instruction.

You MUST respond with ONLY valid JSON (no markdown, no code fences, no explanation outside the JSON). The JSON must match this exact structure:

{
  "summary": "A brief summary of all changes made",
  "slides": [
    {
      "id": 1,
      "title": "Slide title",
      "content": "Updated slide content summary",
      "type": "cover|data|chart|text",
      "changes": ["Description of change 1", "Description of change 2"]
    }
  ]
}

Slide types:
- "cover" for title slides and closing/next-steps slides
- "data" for slides with financial figures, performance metrics, tax data
- "chart" for slides showing allocations, breakdowns, visual data
- "text" for slides with commentary, strategy, narrative content

Important guidelines:
- Maintain a professional, conservative wealth management tone
- Be specific about what numbers/data changed and why
- Include realistic financial figures
- Each slide should have at least one change description
- Generate exactly 8 slides matching a typical annual review structure:
  1. Cover slide (year/client name)
  2. Portfolio Overview (assets, growth)
  3. Asset Allocation (percentages)
  4. Performance Summary (returns vs benchmark)
  5. Market Commentary (narrative)
  6. Tax Planning (liability, strategies)
  7. Forward Strategy (recommendations)
  8. Next Steps (action items)`;

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
    const { files, instruction } = body;

    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction is required" },
        { status: 400 }
      );
    }

    const fileContext = files
      ?.map((f: { name: string; content: string }) => {
        if (f.content) {
          return `--- File: ${f.name} ---\n${f.content}`;
        }
        return `--- File: ${f.name} (binary file uploaded, content not readable in browser) ---`;
      })
      .join("\n\n") || "No files provided";

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here are the uploaded files:\n\n${fileContext}\n\nInstruction: ${instruction}`,
        },
      ],
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
        { error: "Failed to parse Claude response as JSON", raw: textContent.text },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Analyze API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
