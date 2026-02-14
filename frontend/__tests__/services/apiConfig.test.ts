import { describe, it, expect } from 'vitest'
import { createRequestConfig } from '@/services/apiConfig'

describe('apiConfig', () => {
  describe('createRequestConfig', () => {
    it('should return default timeout when no options provided', () => {
      const config = createRequestConfig()

      expect(config.timeout).toBe(30000)
    })

    it('should use custom timeout when provided', () => {
      const config = createRequestConfig({ timeout: 60000 })

      expect(config.timeout).toBe(60000)
    })

    it('should use default timeout when timeout is undefined', () => {
      const config = createRequestConfig({ timeout: undefined })

      expect(config.timeout).toBe(30000)
    })
  })
})

