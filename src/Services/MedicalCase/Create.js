/**
 * The external imports
 */
import uuid from 'react-native-uuid'
/**
 * The internal imports
 */
import { generateNodes } from '@/Services/Node'

export default async ({ algorithm }) => {
  return {
    activities: [],
    comment: '',
    consent: !!algorithm.config.consent_management,
    created_at: null, //new Date(),
    diagnosis: {
      proposed: [],
      excluded: [],
      diagnoses: [],
      additional: {},
      agreed: {},
      refused: [],
      custom: [],
    },
    id: uuid.v4(),
    nodes: generateNodes({ nodes: algorithm.nodes }),
    advancement: {
      stage: 0,
      step: 0,
    },
    synchronized_at: null,
    updated_at: null, //new Date(),
    version_id: algorithm.id,
  }
}
