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
    created_at: new Date(),
    diagnosis: {
      proposed: [],
      excluded: [],
      diagnoses: [],
      additional: [],
      agreed: {},
      custom: [],
    },
    id: uuid.v4(),
    nodes: generateNodes({ nodes: algorithm.nodes }),
    status: '',
    synchronized_at: null,
    updated_at: new Date(),
    version_id: algorithm.id,
  }
}
