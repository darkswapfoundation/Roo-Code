import { Anthropic } from "@anthropic-ai/sdk"
import OpenAI from "openai"

export function convertToOpenAiMessages(
	anthropicMessages: Anthropic.Messages.MessageParam[],
): OpenAI.Chat.ChatCompletionMessageParam[] {
	const openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = []

	for (const anthropicMessage of anthropicMessages) {
		if (typeof anthropicMessage.content === "string") {
			openAiMessages.push({ role: anthropicMessage.role, content: anthropicMessage.content })
		} else {
			// image_url.url is base64 encoded image data
			// ensure it contains the content-type of the image: data:image/png;base64,
			/*
        { role: "user", content: "" | { type: "text", text: string } | { type: "image_url", image_url: { url: string } } },
         // content required unless tool_calls is present
        { role: "assistant", content?: "" | null, tool_calls?: [{ id: "", function: { name: "", arguments: "" }, type: "function" }] },
        { role: "tool", tool_call_id: "", content: ""}
         */
			if (anthropicMessage.role === "user") {
				const nonToolMessages = anthropicMessage.content.filter(
					(part) => part.type === "text"
				) as Anthropic.TextBlock[]

				if (nonToolMessages.length > 0) {
					openAiMessages.push({
						role: "user",
						content: nonToolMessages.map((part) => ({ type: "text", text: part.text })),
					})
				}
			} else if (anthropicMessage.role === "assistant") {
				const nonToolMessages = anthropicMessage.content.filter(
					(part) => part.type === "text"
				) as Anthropic.TextBlock[]

				// Process non-tool messages
				let content: string | undefined
				if (nonToolMessages.length > 0) {
					content = nonToolMessages
						.map((part) => {
							return part.text
						})
						.join("\n")
				}

				openAiMessages.push({
					role: "assistant",
					content,
				})
			}
		}
	}

	return openAiMessages
}
