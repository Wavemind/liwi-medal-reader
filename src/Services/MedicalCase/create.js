import moment from 'moment'

export default async ({ version }) => {
  return {
    id: 0,
    nodes: {},
    activities: [],
    version_id: version.id,
    status: '',
    comment: '',
    created_at: moment().toDate(),
    updated_at: moment().toDate(),
    synchronized_at: null,
    consent: !!version.config.consent_management,
    diagnosis: {
      proposed: [], // Retained by algo
      excluded: [], // Add by the input
      diagnoses: [], // Add even though it's false
      additional: [],
      agreed: {},
      custom: [],
    },
  }
}
