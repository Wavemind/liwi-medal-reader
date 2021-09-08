/**
 * Used to navigating without the navigation prop
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop/
 *
 * You can add other navigation functions that you need and export them
 */
import * as React from 'react'
import { CommonActions } from '@react-navigation/native'

export const navigationRef = React.createRef()

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params)
}

export function navigateAndReset(routes = [], index = 0) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index,
      routes,
    }),
  )
}

export function navigateAndSimpleReset(name, params = {}, index = 0) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index,
      routes: [{ name, params: { ...params } }],
    }),
  )
}
/**
 * Use for redirection after PIN
 */
export function navigateToMedicalCase(medicalCase) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      actions: [
        navigationRef.current?.navigate('Home', {
          screen: 'StageWrapper',
          params: {
            stageIndex: medicalCase.advancement.stage,
            stepIndex: medicalCase.advancement.step,
          },
        }),
      ],
    }),
  )
}

export function navigateToStage(stageIndex, stepIndex = 0) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'StageWrapper', params: { stageIndex, stepIndex } }],
    }),
  )
}

export function navigateNestedAndSimpleReset(name, nestedName, index = 0) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index,
      routes: [{ name: name, state: { routes: [{ name: nestedName }] } }],
    }),
  )
}
