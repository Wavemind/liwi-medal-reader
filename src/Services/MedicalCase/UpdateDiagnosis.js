import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import RemoveAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAgreedDiagnoses'
import AddRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddRefusedDiagnoses'
import RemoveRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveRefusedDiagnoses'
import { store } from '@/Store'
import SetDiagnoses from '@/Store/MedicalCase/Diagnoses/SetDiagnoses'
import { getAvailableDrugs } from '@/Utils/Drug'

/**
 * Updates the proposed diagnoses by sorting them into agreed or refused
 * @param diagnosisId
 * @param value
 */
export default async (diagnosisId, value) => {
  const state = store.getState()
  const agreed = state.medicalCase.item.diagnosis.agreed
  const refused = state.medicalCase.item.diagnosis.refused
  const nodes = state.algorithm.item.nodes

  const isInAgreed = Object.keys(agreed).includes(diagnosisId.toString())
  const isInRefused = refused.includes(diagnosisId)
  // From null to Agree
  if (value && !isInAgreed) {
    const currentNode = nodes[diagnosisId]
    const availableDrugs = getAvailableDrugs(currentNode)

    await store.dispatch(
      AddAgreedDiagnoses.action({
        diagnosisId,
        diagnosisContent: {
          id: diagnosisId,
          managements: Object.values(currentNode.managements).map(
            management => management.id,
          ),
          drugs: {
            proposed: availableDrugs,
            agreed: {},
            refused: [],
            additional: {},
          },
        },
      }),
    )

    // From Disagree to Agree
    if (isInRefused) {
      await store.dispatch(
        RemoveRefusedDiagnoses.action({
          diagnosisId,
        }),
      )
    }
  }

  // From null to Disagree
  if (!value && !isInRefused) {
    await store.dispatch(
      AddRefusedDiagnoses.action({
        diagnosisId,
      }),
    )

    // From Agree to Disagree
    if (isInAgreed) {
      await store.dispatch(
        RemoveAgreedDiagnoses.action({
          diagnosisId,
        }),
      )
    }
  }
  await store.dispatch(SetDiagnoses.action({}))
}
