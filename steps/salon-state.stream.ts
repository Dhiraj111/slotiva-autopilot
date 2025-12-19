// steps/salon-state.stream.ts
import { StreamConfig } from 'motia'
import { z } from 'zod'

// Define the shape of your business data

export const config: StreamConfig = {
    name: 'salonState',
    schema: z.object({
        revenue: z.number(),
        appointments: z.number(),
        inventory: z.object({
            gel: z.number(),
            cream: z.number(),
            dye: z.number(),
            mask: z.number()
        }),
        lastActivity: z.object({
            text: z.string(),
            time: z.string()
        }).optional()
    }),
    baseConfig: { storageType: 'default' }
}

export type SalonState = z.infer<typeof salonSchema>