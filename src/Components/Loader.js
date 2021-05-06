import React from 'react'
import LottieView from 'lottie-react-native'

const Loader = props => {
  const { height } = props

  return (
    <LottieView
      source={require('../Assets/Animations/ripple.json')}
      autoPlay
      style={{ height }}
    />
  )
}

export default Loader