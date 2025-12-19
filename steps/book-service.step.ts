// steps/book-service.step.ts
import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { SalonState } from './salon-state.stream'

const SERVICES = {
  haircut: { price: 200, material: 'gel', usage: 10, label: 'Haircut' },
  shave: { price: 100, material: 'cream', usage: 15, label: 'Shaving' },
  color: { price: 500, material: 'dye', usage: 25, label: 'Hair Color' },
  spa: { price: 800, material: 'mask', usage: 1, label: 'Face Spa' }
} as const

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'BookService',
  method: 'POST',
  path: '/book',
  bodySchema: z.object({
    serviceKey: z.enum(['haircut', 'shave', 'color', 'spa']),
    customerName: z.string().min(1)
  }),
  responseSchema: {
    200: z.object({ success: z.boolean(), message: z.string() }),
    400: z.object({ error: z.string() })
  },
  emits: []
}

export const handler: Handlers['BookService'] = async (req, { streams }) => {
  const { serviceKey, customerName } = req.body
  const branchId = 'main-branch'

  // 1. Load existing salon state (MUST exist)
  const currentState = await streams.salonState.get(branchId, 'stats')

  if (!currentState) {
    return {
      status: 400,
      body: { error: 'Salon not initialized. Please initialize first.' }
    }
  }

  const service = SERVICES[serviceKey]

  // 2. Validate inventory availability
  const availableQty = currentState.inventory[service.material]

  if (availableQty < service.usage) {
    return {
      status: 400,
      body: { error: `Insufficient ${service.material} in inventory` }
    }
  }

  // 3. Create new salon state (pure calculation)
  const newState: SalonState = {
    revenue: currentState.revenue + service.price,
    appointments: currentState.appointments + 1,
    inventory: {
      ...currentState.inventory,
      [service.material]: availableQty - service.usage
    },
    lastActivity: {
      text: `Customer '${customerName}' booked ${service.label}`,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // 4. Commit state update (single source of truth)
  await streams.salonState.set(branchId, 'stats', newState)

  return {
    status: 200,
    body: {
      success: true,
      message: `Booked ${service.label} successfully`
    }
  }
}
