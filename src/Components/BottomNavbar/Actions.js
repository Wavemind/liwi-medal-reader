/**
 * The external imports
 */
import React from 'react'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { SynchronizationNavbar, StageWrapperNavbar } from '@/Components'

const Actions = ({ navigationState }) => {
  const medicalCase = useSelector(state => state.medicalCase.item)

  if (medicalCase !== undefined && medicalCase.closedAt === 0) {
    return (
      <StageWrapperNavbar
        stageIndex={medicalCase.advancement.stage}
        stepIndex={medicalCase.advancement.step}
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

export default Actions
