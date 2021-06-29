/**
 * The external imports
 */
import React from 'react'

/**
 * The internal imports
 */
import StageWrapperNavbar from '@/Components/BottomNavbar/StageWrapperNavbar'
import SynchronizationNavbar from '@/Components/BottomNavbar/SynchronizationNavbar'

const NavbarActions = ({ navigationState }) => {
  const homeNavigation = navigationState.routes[navigationState.index].state

  const route = homeNavigation?.routes[homeNavigation.index]
  // Early return if navigation is not loaded
  if (route === undefined) {
    return null
  }

  const { name, params } = route

  const stageIndex = params?.stageIndex || 0
  const stepIndex = params?.stepIndex || 0
  switch (name) {
    case 'StageWrapper':
      return (
        <StageWrapperNavbar stageIndex={stageIndex} stepIndex={stepIndex} />
      )
    case 'Synchronization':
      return <SynchronizationNavbar />
    default:
      return null
  }
}

export default NavbarActions
