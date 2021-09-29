/**
 * The external imports
 */
import React from 'react'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { SynchronizationNavbar, StageWrapperNavbar } from '@/Components'

const ActionsNavbar = ({ navigationState }) => {
  let name
  let stageIndex
  let stepIndex

  const advancement = useSelector(state => state.medicalCase.item.advancement)
  if (advancement !== undefined) {
    stageIndex = advancement.stage
    stepIndex = advancement.step
    name = 'StageWrapper'
  } else {
    const homeNavigation = navigationState.routes[navigationState.index].state
    const route = homeNavigation?.routes[homeNavigation.index]
    // Early return if navigation is not loaded
    if (route === undefined) {
      return null
    }
  }

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

export default ActionsNavbar
