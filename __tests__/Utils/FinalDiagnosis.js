import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import { getAvailableDrugs } from '@/Utils/Drug'

import { store } from '@/Store'

export const agreeFinalDiagnosis = async (nodeId, node) => {
  store.dispatch(
    AddAgreedDiagnoses.action({
      diagnosisId: nodeId,
      diagnosisContent: {
        id: nodeId,
        managements: Object.values(node.managements).map(
          management => management.id,
        ),
        drugs: {
          proposed: getAvailableDrugs(node),
          agreed: {},
          refused: [],
          additional: {},
        },
      },
    }),
  )
}
