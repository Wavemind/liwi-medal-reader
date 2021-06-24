/**
 * The internal imports
 */
import { store } from '@/Store'
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'
import SetDrugs from '@/Store/MedicalCase/Drugs/SetDrugs'

/**
 * Updates the proposed drugs by sorting them into agreed or refused
 * @param diagnosisId
 * @param drugId
 * @param value
 */
export default async (diagnosisId, drugId, value, diagnosisKey) => {
  const state = store.getState()
  const diagnosis = state.medicalCase.item.diagnosis[diagnosisKey][diagnosisId]

  const isInAgreed = Object.keys(diagnosis.drugs.agreed).includes(
    drugId.toString(),
  )
  const isInRefused = diagnosis.drugs.refused.includes(drugId)

  // From null to Agree
  if (value && !isInAgreed) {
    store.dispatch(
      AddAgreedDrugs.action({
        diagnosisKey,
        diagnosisId,
        drugId,
      }),
    )

    // From Disagree to Agree
    if (isInRefused) {
      store.dispatch(
        RemoveRefusedDrugs.action({
          diagnosisKey,
          diagnosisId,
          drugId,
        }),
      )
    }
  }

  // From null to Disagree
  if (!value && !isInRefused) {
    store.dispatch(
      AddRefusedDrugs.action({
        diagnosisKey,
        diagnosisId,
        drugId,
      }),
    )

    // From Agree to Disagree
    if (isInAgreed) {
      store.dispatch(
        RemoveAgreedDrugs.action({
          diagnosisKey,
          diagnosisId,
          drugId,
        }),
      )
    }
  }

  await store.dispatch(SetDrugs.action())
}
