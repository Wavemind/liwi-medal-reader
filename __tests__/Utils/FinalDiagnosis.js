import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import { getAvailableDrugs } from '@/Utils/Drug'

import { store } from '@/Store'

/**
 * Adds a final diagnosis in the agreed final diagnosis
 * @param {FinalDiagnosis} node :  the final diagnosis we want to agree
 */
export const agreeFinalDiagnosis = async node => {
  store.dispatch(
    AddAgreedDiagnoses.action({
      diagnosisId: node.id,
      diagnosisContent: {
        id: node.id,
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
