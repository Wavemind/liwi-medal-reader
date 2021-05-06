import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useDispatch } from 'react-redux'

import { useTheme } from '@/Theme'
import InitStartup from '@/Store/Startup/Init'
import Loader from '@/Components/Loader'

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
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <Animated.View style={startupIndex.animation(fadeAnim)}>
      <Loader />
    </Animated.View>
  )
}

export default IndexStartupContainer
