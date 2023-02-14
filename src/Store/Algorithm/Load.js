/**
 * The external imports
 */
import { createAction } from '@reduxjs/toolkit'
import * as Sentry from '@sentry/react-native'

export default {
  initialState: {},
  action: createAction('algorithm/load'),
  reducers(state, { payload }) {
    const nodes = {
      ...payload.newAlgorithm.nodes,
      ...payload.newAlgorithm.final_diagnoses,
      ...payload.newAlgorithm.health_cares,
    }

    // Remove useless key
    delete payload.newAlgorithm.nodes
    delete payload.newAlgorithm.final_diagnoses
    delete payload.newAlgorithm.health_cares

    // Store algorithm
    const algorithm = {
      ...payload.newAlgorithm,
      updated: false,
      nodes: { ...nodes },
    }

    Sentry.setContext('Algorithm', {
      algorithm_id: algorithm.id,
      algorithm_name: algorithm.algorithm_name,
      version_id: algorithm.version_id,
      version_name: algorithm.version_name,
      study_id: algorithm.study.id,
      study_name: algorithm.study.label,
      is_arm_control: algorithm.is_arm_control,
    })

    state.item = algorithm
  },
}
