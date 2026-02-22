import { describe, it, expect, beforeEach } from 'vitest'
import { act } from 'react'
import useCustomColorStore from '@/stores/useCustomColorStore'

describe('useCustomColorStore', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useCustomColorStore.getState().clearColors()
    })
  })

  it('should start with empty custom colors', () => {
    const { customColors } = useCustomColorStore.getState()
    expect(customColors).toEqual([])
  })

  it('should add a custom color', () => {
    act(() => {
      useCustomColorStore.getState().addColor('#ff5733')
    })
    const { customColors } = useCustomColorStore.getState()
    expect(customColors).toContain('#ff5733')
  })

  it('should not add more than 5 colors', () => {
    act(() => {
      useCustomColorStore.getState().addColor('#ff0001')
      useCustomColorStore.getState().addColor('#ff0002')
      useCustomColorStore.getState().addColor('#ff0003')
      useCustomColorStore.getState().addColor('#ff0004')
      useCustomColorStore.getState().addColor('#ff0005')
      useCustomColorStore.getState().addColor('#ff0006')
      useCustomColorStore.getState().addColor('#ff0007')
    })
    const { customColors } = useCustomColorStore.getState()
    expect(customColors.length).toBe(5)
  })

  it('should remove a custom color', () => {
    act(() => {
      useCustomColorStore.getState().addColor('#ff5733')
      useCustomColorStore.getState().removeColor('#ff5733')
    })
    const { customColors } = useCustomColorStore.getState()
    expect(customColors).not.toContain('#ff5733')
  })

  it('should not add duplicate colors', () => {
    act(() => {
      useCustomColorStore.getState().addColor('#ff5733')
      useCustomColorStore.getState().addColor('#ff5733')
    })
    const { customColors } = useCustomColorStore.getState()
    expect(customColors.length).toBe(1)
  })

  it('should not add duplicate colors case-insensitive', () => {
    act(() => {
      useCustomColorStore.getState().addColor('#FF5733')
      useCustomColorStore.getState().addColor('#ff5733')
    })
    const { customColors } = useCustomColorStore.getState()
    expect(customColors.length).toBe(1)
  })

  it('should clear all colors', () => {
    act(() => {
      useCustomColorStore.getState().addColor('#ff5733')
      useCustomColorStore.getState().addColor('#00ff00')
      useCustomColorStore.getState().clearColors()
    })
    const { customColors } = useCustomColorStore.getState()
    expect(customColors).toEqual([])
  })
})

