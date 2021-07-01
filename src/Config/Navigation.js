/**
 * The internal imports
 */
// Registration
import RegistrationMedicalCaseContainer from '@/Containers/MedicalCase/Registration/Registration'
// First Assessments
import UniqueTriageQuestionsMedicalCaseContainer from '@/Containers/MedicalCase/FirstAssessment/UniqueTriageQuestions'
import ComplaintCategoryMedicalCaseContainer from '@/Containers/MedicalCase/FirstAssessment/ComplaintCategory'
import BasicMeasurementMedicalCaseContainer from '@/Containers/MedicalCase/FirstAssessment/BasicMeasurement'
// Consultation
import PhysicalExamMedicalCaseContainer from '@/Containers/MedicalCase/Consultation/PhysicalExam'
import MedicalHistoryMedicalCaseContainer from '@/Containers/MedicalCase/Consultation/MedicalHistory'
// Assessment
import AssessmentMedicalCaseContainer from '@/Containers/MedicalCase/Assessment/Assessment'
// Diagnosis
import FinalDiagnosesMedicalCaseContainer from '@/Containers/MedicalCase/Diagnoses/FinalDiagnoses'
import DrugsMedicalCaseContainer from '@/Containers/MedicalCase/Diagnoses/Drugs'
import TreatmentConditionsMedicalCaseContainer from '@/Containers/MedicalCase/Diagnoses/TreatmentConditions'
import ReferralMedicalCaseContainer from '@/Containers/MedicalCase/Diagnoses/Referral'
import FormulationsMedicalCaseContainer from '@/Containers/MedicalCase/Diagnoses/Formulations'
import SummaryMedicalCaseContainer from '@/Containers/MedicalCase/Diagnoses/Summary'
// Arm Control
import ArmFinalDiagnosesMedicalCaseContainer from '@/Containers/ArmControl/Diagnoses/FinalDiagnoses'
import ArmDrugsMedicalCaseContainer from '@/Containers/ArmControl/Diagnoses/Drugs'
import AssessmentArmControlMedicalCaseContainer from '@/Containers/ArmControl/Assessment'

//
// We splitted the stages because some algorithms don't have referral so we are building the Stages with different pieces
//

const diagnosesStage = {
  label: 'diagnoses',
  icon: 'diagnosis',
  component: 'DiagnosesWrapper',
  steps: [
    {
      label: 'final_diagnoses',
      component: FinalDiagnosesMedicalCaseContainer,
    },
    {
      label: 'healthcare_questions',
      component: TreatmentConditionsMedicalCaseContainer,
    },
    {
      label: 'medicines',
      component: DrugsMedicalCaseContainer,
    },
    {
      label: 'formulations',
      component: FormulationsMedicalCaseContainer,
    },
    {
      label: 'summary',
      component: SummaryMedicalCaseContainer,
    },
  ],
}

const referralStep = {
  label: 'referral',
  component: ReferralMedicalCaseContainer,
}

const baseInterventionStages = [
  {
    label: 'registration',
    icon: 'registration',
    component: 'RegistrationWrapper',
    steps: [
      {
        label: 'registration',
        component: RegistrationMedicalCaseContainer,
      },
    ],
  },
  {
    label: 'first_assessments',
    icon: 'assessment',
    component: 'FirstAssessmentsWrapper',
    steps: [
      {
        label: 'unique_triage_questions',
        component: UniqueTriageQuestionsMedicalCaseContainer,
      },
      {
        label: 'complaint_categories',
        component: ComplaintCategoryMedicalCaseContainer,
      },
      {
        label: 'basic_measurements',
        component: BasicMeasurementMedicalCaseContainer,
      },
    ],
  },
  {
    label: 'consultation',
    icon: 'consultation',
    component: 'ConsultationWrapper',
    steps: [
      {
        label: 'medical_history',
        component: MedicalHistoryMedicalCaseContainer,
      },
      {
        label: 'physical_exams',
        component: PhysicalExamMedicalCaseContainer,
      },
    ],
  },
  {
    label: 'assessments',
    icon: 'tests',
    component: 'AssessmentsWrapper',
    steps: [
      {
        label: 'assessments',
        component: AssessmentMedicalCaseContainer,
      },
    ],
  },
]

const armControlDiagnosesStage = {
  label: 'diagnoses',
  icon: 'diagnosis',
  component: 'DiagnosesWrapper',
  steps: [
    {
      label: 'final_diagnoses',
      component: ArmFinalDiagnosesMedicalCaseContainer,
    },
    {
      label: 'medicines',
      component: ArmDrugsMedicalCaseContainer,
    },
  ],
}

const baseArmControlStages = [
  {
    label: 'registration',
    icon: 'registration',
    component: 'RegistrationWrapper',
    steps: [
      {
        label: 'registration',
        component: RegistrationMedicalCaseContainer,
      },
    ],
  },
  {
    label: 'first_assessments',
    icon: 'assessment',
    component: 'FirstAssessmentsWrapper',
    steps: [
      {
        label: 'unique_triage_questions',
        component: UniqueTriageQuestionsMedicalCaseContainer,
      },
      {
        label: 'complaint_categories',
        component: ComplaintCategoryMedicalCaseContainer,
      },
      {
        label: 'basic_measurements',
        component: BasicMeasurementMedicalCaseContainer,
      },
    ],
  },
  {
    label: 'assessments',
    icon: 'tests',
    component: 'AssessmentsWrapper',
    steps: [
      {
        label: 'assessments',
        component: AssessmentArmControlMedicalCaseContainer,
      },
    ],
  },
]

const INTERVENTION_STAGES = [...baseInterventionStages, diagnosesStage]

const REFERRAL_INTERVENTION_STAGES = [
  ...baseInterventionStages,
  { ...diagnosesStage, steps: [...diagnosesStage.steps, referralStep] },
]

const ARM_CONTROL_STAGES = [...baseArmControlStages, armControlDiagnosesStage]

const REFERRAL_ARM_CONTROL_STAGES = [
  ...baseArmControlStages,
  {
    ...armControlDiagnosesStage,
    steps: [...armControlDiagnosesStage.steps, referralStep],
  },
]

export default {
  INTERVENTION_CONSULTATION_STAGE: 2,
  ARM_CONTROL_ASSESSMENT_STAGE: 2,
  INTERVENTION_STAGES,
  REFERRAL_INTERVENTION_STAGES,
  ARM_CONTROL_STAGES,
  REFERRAL_ARM_CONTROL_STAGES,
}
