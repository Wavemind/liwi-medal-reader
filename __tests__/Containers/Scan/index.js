/**
 * @format
 */
import 'react-native'
import React from 'react'
import { getQrData } from '@/Containers/Scan/Index'

// Note: test renderer must be required after react-native.

describe('Scan QR code tests', () => {
  it('should return object', () => {
    expect(getQrData({})).toBe({})
  })
})
