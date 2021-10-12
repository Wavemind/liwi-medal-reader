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
  const advancement = useSelector(state => state.medicalCase.item.advancement)

  if (advancement !== undefined) {
    return (
      <StageWrapperNavbar
        stageIndex={advancement.stage}
        stepIndex={advancement.step}
      />
    )
  } else {
    const homeNavigation = navigationState.routes[navigationState.index].state
    const route = homeNavigation?.routes[homeNavigation.index]

    if (route?.name === 'Synchronization') {
      return <SynchronizationNavbar />
    }

    return null
  }
}

export default ActionsNavbar
