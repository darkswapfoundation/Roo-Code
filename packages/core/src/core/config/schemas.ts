import { z } from "zod"

import { providerSettingsWithIdSchema } from "@roo-code/types"

export const providerProfilesSchema = z.object({
	currentApiConfigName: z.string(),
	apiConfigs: z.lazy(() => z.record(z.string(), providerSettingsWithIdSchema)),
	modeApiConfigs: z.record(z.string(), z.string()).optional(),
	cloudProfileIds: z.array(z.string()).optional(),
	migrations: z
		.object({
			rateLimitSecondsMigrated: z.boolean().optional(),
			diffSettingsMigrated: z.boolean().optional(),
			openAiHeadersMigrated: z.boolean().optional(),
			consecutiveMistakeLimitMigrated: z.boolean().optional(),
			todoListEnabledMigrated: z.boolean().optional(),
		})
		.optional(),
})

export type ProviderProfiles = z.infer<typeof providerProfilesSchema>