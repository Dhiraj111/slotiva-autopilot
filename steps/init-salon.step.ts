// steps/init-salon.step.ts
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { SalonState } from './salon-state.stream'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'InitSalon',
  method: 'POST',
  path: '/init-salon',
  bodySchema: z.object({
    inventory: z.object({
      gel: z.number().min(0),
      cream: z.number().min(0),
      dye: z.number().min(0),
      mask: z.number().min(0)
    })
  }),
  responseSchema: {
    200: z.object({ success: z.boolean(), message: z.string() }),
    400: z.object({ error: z.string() })
  },
  emits: []
}

export const handler: Handlers['InitSalon'] = async (_, { streams }) => {
  const branchId = 'main-branch'

  const existingState = await streams.salonState.get(branchId, 'stats')

  // Prevent re-initialization
  if (existingState) {
    return {
      status: 400,
      body: { error: 'Salon is already initialized' }
    }
  }

  const initialState: SalonState = {
    revenue: 0,
    appointments: 0,
    inventory: {
      gel: 100,
      cream: 50,
      dye: 80,
      mask: 30
    },
    lastActivity: {
      text: 'Salon initialized',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  await streams.salonState.set(branchId, 'stats', initialState)

  return {
    status: 200,
    body: { success: true, message: 'Salon initialized successfully' }
  }
}
