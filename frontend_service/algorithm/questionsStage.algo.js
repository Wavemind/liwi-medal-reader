import * as _ from 'lodash';

import moment from 'moment';
import { store } from '../store';
import { categories } from '../constants';
import { updateMetaData, setAnswer } from '../actions/creators.actions';
import { calculateCondition } from './conditionsHelpers.algo';

/**
 * This file contains methods to filter questions to each stages / steps
 */

/**
 * Get Medical History for consultation
 * Update metadata
 */
export const questionsMedicalHistory = () => {
  const state$ = store.getState();
  const { diagnostics } = state$;
  const medicalHistoryQuestions = state$.nodes.filterBy(
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.symptom,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.exposure,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.chronicCondition,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.observedPhysicalSign,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.vaccine,
      }
    ],
    diagnostics,
    'OR',
    'array',
    true
  );

  const newQuestions = medicalHistoryQuestions.map(({ id }) => id);

  // Update state$ medical history questions if it's different from new questions list
  if (!_.isEqual(state$.metaData.consultation.medicalHistory, newQuestions)) {
    store.dispatch(updateMetaData('consultation', 'medicalHistory', newQuestions));
  }

  return sortQuestions(medicalHistoryQuestions);
};

/**
 * Sorts the array of question
 * @param questions - Array to sort
 * @returns {Array<QuestionModel>} - Sorted array
 */
const sortQuestions = (questions) => {
  return questions.sort((a, b) => {
    if (a.is_danger_sign === b.is_danger_sign) return 0;
    if (a.is_danger_sign === true) return -1;
    return 1;
  });
};

/**
 * Get physical Exam for consultation
 * Update metadata
 */
export const questionsPhysicalExam = () => {
  const state$ = store.getState();
  const { diagnostics } = state$;
  const vitalSignQuestions = state$.nodes.filterBy(
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.vitalSignAnthropometric,
      },
    ],
    diagnostics,
    'OR',
    'array',
    false
  );

  const physicalExamQuestions = state$.nodes.filterBy(
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.physicalExam,
      },
    ],
    diagnostics,
    'OR',
    'array',
    true
  );

  const questions = vitalSignQuestions.concat(physicalExamQuestions);
  const newQuestions = questions.map(({ id }) => id);

  // Update state$ physical exam questions if it's different from new questions list
  if (!_.isEqual(state$.metaData.consultation.physicalExam, newQuestions)) {
    store.dispatch(updateMetaData('consultation', 'physicalExam', newQuestions));
  }

  return sortQuestions(questions);
};

/**
 * Get FirstLook Assessement for triage
 * Update metadata
 */
export const questionsFirstLookAssessement = () => {
  const state$ = store.getState();
  const firstLookAssessement = [];

  const ordersFirstLookAssessment = state$.mobile_config.questions_orders[categories.emergencySign];

  if (ordersFirstLookAssessment !== undefined) {
    ordersFirstLookAssessment.forEach((order) => {
      firstLookAssessement.push(state$.nodes[order]);
    });
  }

  const newQuestions = firstLookAssessement.map(({ id }) => id);

  // Update state$ first look assessment questions if it's different from new questions list
  if (!_.isEqual(state$.metaData.triage.firstLookAssessments, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'firstLookAssessments', newQuestions));
  }

  return firstLookAssessement;
};

/**
 * Get ComplaintCategories for triage
 * Update metadata
 */
export const questionsComplaintCategory = () => {
  const state$ = store.getState();
  const complaintCategories = [];
  const orders = state$.mobile_config.questions_orders[categories.complaintCategory];
  const { general_cc_id } = state$.config.basic_questions;

  const birthDate = state$.nodes[state$.config.basic_questions.birth_date_question_id].value;
  const days = birthDate !== null ? moment().diff(birthDate, 'days') : 0;

  store.dispatch(setAnswer(general_cc_id, Object.keys(state$.nodes[general_cc_id].answers)[0]));
  orders.forEach((order) => {
    if (state$.nodes[order].id !== state$.config.basic_questions.general_cc_id) {
      // Differentiate complaint categories specific for neo_nat (<= 60 days) cases and others
      // For all questions that do not appear, set the answer to "No"
      if ((days <= 60 && state$.nodes[order].is_neonat) || (days > 60 && !state$.nodes[order].is_neonat)) {
        complaintCategories.push(state$.nodes[order]);
      } else {
        store.dispatch(setAnswer(order, Object.keys(state$.nodes[order].answers)[1]));
      }
    }
  });
  const newQuestions = complaintCategories.map(({ id }) => id);

  // Update state$ complaint categories questions if it's different from new questions list
  if (!_.isEqual(state$.metaData.triage.complaintCategories, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'complaintCategories', newQuestions));
  }

  return complaintCategories;
};

/**
 * Get Basic Measurements for triage
 * Update metadata
 */
export const questionsBasicMeasurements = () => {
  const state$ = store.getState();
  const basicMeasurements = [];

  const orderedQuestions = state$.mobile_config.questions_orders[categories.basicMeasurement];

  if (orderedQuestions !== undefined) {
    orderedQuestions.forEach((orderedQuestion) => {
      const question = state$.nodes[orderedQuestion];
      if (question.isDisplayedInTriage(state$)) {
        basicMeasurements.push(question);
      }
    });
  }

  const newQuestions = basicMeasurements.map(({ id }) => id);

  // Update state$ basic measurements questions if it's different from new questions list
  if (!_.isEqual(state$.metaData.triage.basicMeasurements, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'basicMeasurements', newQuestions));
  }

  return basicMeasurements;
};

/**
 * Get questions for Test
 * Update metadata
 */
export const questionsTests = () => {
  const state$ = store.getState();
  const { diagnostics } = state$;
  let assessmentTest = [];
  assessmentTest = state$.nodes.filterBy(
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.assessment,
      },
    ],
    diagnostics
  );

  const newQuestions = assessmentTest.map(({ id }) => id);

  // Update state$ tests questions if it's different from new questions list
  if (!_.isEqual(state$.metaData.tests.tests, newQuestions)) {
    store.dispatch(updateMetaData('tests', 'tests', newQuestions));
  }

  return assessmentTest;
};

/**
 *
 * Define if the title of drugs additional / proposed must be shown
 *
 * @return :  Boolean
 *
 */
export const titleManagementCounseling = () => {
  const state$ = store.getState();
  const { diagnoses } = state$;

  if (Object.keys(diagnoses.additional).length === 0 && Object.keys(diagnoses.proposed).length === 0) {
    return false;
  }

  let isPossible = false;
  Object.keys(diagnoses.additional).forEach((id) => {
    Object.keys(diagnoses.additional[id].managements).forEach((m) => {
      if (calculateCondition(diagnoses.additional[id].managements[m]) === true) {
        isPossible = true;
      }
    });
  });

  Object.keys(diagnoses.proposed).forEach((id) => {
    Object.keys(diagnoses.proposed[id].managements).forEach((m) => {
      if (calculateCondition(diagnoses.proposed[id].managements[m]) === true) {
        isPossible = true;
      }
    });
  });

  return isPossible;
};
