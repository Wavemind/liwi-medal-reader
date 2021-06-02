import { generateNodes } from '@/Services/Node'
export default async ({ algorithm }) => {
  return {
    activities: [],
    comment: '',
    consent: !!algorithm.config.consent_management,
    created_at: 'MM/DD/YYYY HH:mm:ss',
    diagnosis: {
      proposed: [],
      excluded: [],
      diagnoses: [],
      additional: [],
      agreed: {},
      custom: [],
    },
    id: 0,
    nodes: generateNodes({ nodes: algorithm.nodes }),
    status: '',
    synchronized_at: null,
    updated_at: 'MM/DD/YYYY HH:mm:ss',
    version_id: algorithm.id,
  }
}
