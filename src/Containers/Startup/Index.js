/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { Loader } from '@/Components'
import InitStartup from '@/Store/Startup/Init'

const IndexStartupContainer = () => {
  const {
    Containers: { startupIndex },
  } = useTheme()

  const dispatch = useDispatch()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    dispatch(InitStartup.action())
  }, [dispatch])

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  return (
    <Animated.View style={startupIndex.animation(fadeAnim)}>
      <Loader />
    </Animated.View>
  )
}

export default IndexStartupContainer
