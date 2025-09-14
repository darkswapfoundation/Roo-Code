import { Anthropic } from "@anthropic-ai/sdk"

/**
 * Convert complex content blocks to simple string content
 */
export function convertToSimpleContent(content: Anthropic.Messages.MessageParam["content"]): string {
	if (typeof content === "string") {
		return content
	}

	// Extract text from content blocks
	return content
		.map((block) => {
			if (block.type === "text") {
				return block.text
			}
			if (block.type === "image") {
				if (block.source.type === "base64") {
					return `[Image: ${block.source.media_type}]`
				}
				return `[Image]`
			}
			return ""
		})
		.filter(Boolean)
		.join("\n")
}

/**
 * Convert Anthropic messages to simple format with string content
 */
export function convertToSimpleMessages(
	messages: Anthropic.Messages.MessageParam[],
): Array<{ role: "user" | "assistant"; content: string }> {
	return messages.map((message) => ({
		role: message.role,
		content: convertToSimpleContent(message.content),
	}))
}
