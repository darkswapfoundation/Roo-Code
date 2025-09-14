import { Anthropic } from "@anthropic-ai/sdk"
import { Content, Part } from "@google/genai"

export function convertAnthropicContentToGemini(content: string | Anthropic.TextBlock[]): Part[] {
	if (typeof content === "string") {
		return [{ text: content }]
	}

	return content.flatMap((block): Part | Part[] => {
		switch (block.type) {
			case "text":
				return { text: block.text }
			default:
				return []
		}
	})
}

export function convertAnthropicMessageToGemini(message: Anthropic.Messages.MessageParam): Content {
	return {
		role: message.role === "assistant" ? "model" : "user",
		parts: convertAnthropicContentToGemini(message.content as Anthropic.TextBlock[]),
	}
}
