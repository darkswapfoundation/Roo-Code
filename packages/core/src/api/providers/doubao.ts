import { OpenAiHandler } from "./openai"
import type { ApiHandlerOptions } from "../../shared/api"
import { DOUBAO_API_BASE_URL, doubaoDefaultModelId, doubaoModels } from "@roo-code/types"
import { getModelParams } from "../transform/model-params"
import { ApiStreamUsageChunk } from "../transform/stream"


export class DoubaoHandler extends OpenAiHandler {
	constructor(options: ApiHandlerOptions) {
		super({
			...options,
			openAiApiKey: options.doubaoApiKey ?? "not-provided",
			openAiModelId: options.apiModelId ?? doubaoDefaultModelId,
			openAiBaseUrl: options.doubaoBaseUrl ?? DOUBAO_API_BASE_URL,
			openAiStreamingEnabled: true,
			includeMaxTokens: true,
		})
	}

	override getModel() {
		const id = this.options.apiModelId ?? doubaoDefaultModelId
		const info = doubaoModels[id as keyof typeof doubaoModels] || doubaoModels[doubaoDefaultModelId]
		const params = getModelParams({ format: "openai", modelId: id, model: info, settings: this.options })
		return { id, info, ...params }
	}

	// Override to handle Doubao's usage metrics, including caching.
	protected override processUsageMetrics(usage: any): ApiStreamUsageChunk {
		return {
			type: "usage",
			inputTokens: usage?.prompt_tokens || 0,
			outputTokens: usage?.completion_tokens || 0,
			cacheWriteTokens: usage?.prompt_tokens_details?.cache_miss_tokens,
			cacheReadTokens: usage?.prompt_tokens_details?.cached_tokens,
		}
	}
}
