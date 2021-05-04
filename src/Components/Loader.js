import React from 'react'
import LottieView from 'lottie-react-native'

const Loader = () => {
  return <LottieView source={require('../Assets/ripple.json')} autoPlay loop />
}

export default Loader
