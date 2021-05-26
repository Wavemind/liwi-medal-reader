/**
 * The external imports
 */
import React from 'react'
import LottieView from 'lottie-react-native'

const Loader = ({ height }) => {
  return (
    <LottieView
      source={require('../../Assets/Animations/ripple.json')}
      autoPlay
      style={{ height }}
    />
  )
}

export default Loader
