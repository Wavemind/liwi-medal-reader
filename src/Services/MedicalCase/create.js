import moment from 'moment'

export default async ({ version }) => {
  return {
    activities: [],
    comment: '',
    consent: !!version.config.consent_management,
    created_at: moment().toDate(),
    diagnosis: {
      proposed: [], // Retained by algo
      excluded: [], // Add by the input
      diagnoses: [], // Add even though it's false
      additional: [],
      agreed: {},
      custom: [],
    },
    id: 0,
    nodes: {},
    status: '',
    synchronized_at: null,
    updated_at: moment().toDate(),
    version_id: version.id,
  }
}
