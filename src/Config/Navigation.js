import React from 'react'
import { View, Text } from 'react-native'

//
// We splited the stages because some algorithme don't have referral so we are building the Stages with diffrent pieces
//

function UniqueTriageQuestions() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  )
}

function ComplaintCategories() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}

function BasicMeasurements() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}
function Registration() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}
function MedicalHistory() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}
function PhysicalExams() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}
function Comment() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}

const diagnosesStage = {
  label: 'diagnoses',
  component: 'DiagnosisesWrapper',
  steps: [
    {
      label: 'final_diagnoses',
      component: 'FinalDiagnoses',
    },
    {
      label: 'healthcare_questions',
      component: 'HealthcareQuestions',
    },
    {
      label: 'medicines',
      component: 'Medicines',
    },
    {
      label: 'formulations',
      component: 'Formulations',
    },
    {
      label: 'summary',
      component: 'Summary',
    },
  ],
}

const referralStep = {
  label: 'referral',
  component: 'Referral',
}

const baseInterventionStages = [
  {
    label: 'registration',
    component: 'RegistrationWrapper',
    steps: [
      {
        label: 'registration',
        component: Registration,
      },
    ],
  },
  {
    label: 'first_assessments',
    component: 'FirstAssesmentsWrapper',
    steps: [
      {
        label: 'unique_triage_questions',
        component: UniqueTriageQuestions,
      },
      {
        label: 'complaint_categories',
        component: ComplaintCategories,
      },
      {
        label: 'basic_measurements',
        component: BasicMeasurements,
      },
    ],
  },
  {
    label: 'consultation',
    component: 'ConsultationWrapper',
    steps: [
      {
        label: 'medical_history',
        component: UniqueTriageQuestions,
      },
      {
        label: 'physical_exams',
        component: ComplaintCategories,
      },
      {
        label: 'comment',
        component: BasicMeasurements,
      },
    ],
  },
  {
    label: 'assessments',
    component: 'AssessmentsWrapper',
    steps: [
      {
        label: 'assessments',
        component: BasicMeasurements,
      },
    ],
  },
]

const INTERVENTION_STAGES = [...baseInterventionStages, diagnosesStage]

const REFERAL_INTERVENTION_STAGES = [
  ...baseInterventionStages,
  { ...diagnosesStage, steps: [...diagnosesStage.steps, referralStep] },
]

const ARM_CONTROL_STAGES = INTERVENTION_STAGES

export default {
  INTERVENTION_STAGES,
  REFERAL_INTERVENTION_STAGES,
  ARM_CONTROL_STAGES,
}
