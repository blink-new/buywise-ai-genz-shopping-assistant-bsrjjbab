import { createClient } from '@blinkdotnew/sdk'

let blink: ReturnType<typeof createClient>

try {
  blink = createClient({
    projectId: 'buywise-ai-genz-shopping-assistant-bsrjjbab',
    authRequired: true
  })

  // Disable analytics to prevent network errors
  if (blink.analytics && blink.analytics.disable) {
    blink.analytics.disable()
  }
} catch (error) {
  console.warn('Blink SDK initialization warning:', error)
  // Fallback initialization without analytics
  blink = createClient({
    projectId: 'buywise-ai-genz-shopping-assistant-bsrjjbab',
    authRequired: true
  })
}

export { blink }