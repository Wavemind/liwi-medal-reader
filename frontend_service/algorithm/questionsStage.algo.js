import * as _ from 'lodash';

import moment from 'moment';
import { store } from '../store';
import { categories } from '../constants';
import { updateMetaData, setAnswer } from '../actions/creators.actions';
import { nodeFilterBy } from '../engine/models/Node.model';
import { questionIsDisplayedInTriage } from '../engine/models/Question.model';

/**
 * This file contains methods to filter questions to each stages / steps
 */

/**
 * Get Medical History for consultation
 * Update metadata
 */
export const questionsMedicalHistory = (algorithm) => {
  const medicalCase = store.getState();
  const medicalHistoryQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
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
      },
    ],
    'OR',
    'array',
    true
  );

  const newQuestions = medicalHistoryQuestions.map(({ id }) => id);

  // Update state$ medical history questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.consultation.medicalHistory, newQuestions)) {
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
export const questionsPhysicalExam = (algorithm) => {
  const medicalCase = store.getState();
  const vitalSignQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.vitalSignAnthropometric,
      },
    ],
    'OR',
    'array',
    false
  );

  const physicalExamQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.physicalExam,
      },
    ],
    'OR',
    'array',
    true
  );

  const questions = vitalSignQuestions.concat(physicalExamQuestions);
  const newQuestions = questions.map(({ id }) => id);

  // Update state$ physical exam questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.consultation.physicalExam, newQuestions)) {
    store.dispatch(updateMetaData('consultation', 'physicalExam', newQuestions));
  }

  return sortQuestions(questions);
};

/**
 * Get FirstLook Assessment for triage
 * Update metadata
 */
export const questionsFirstLookAssessment = (algorithm) => {
  const medicalCase = store.getState();
  const firstLookAssessment = [];

  const ordersFirstLookAssessment = algorithm.mobile_config.questions_orders[categories.emergencySign];

  if (ordersFirstLookAssessment !== undefined) {
    ordersFirstLookAssessment.forEach((order) => {
      firstLookAssessment.push(medicalCase.nodes[order]);
    });
  }

  const newQuestions = firstLookAssessment.map(({ id }) => id);

  // Update state$ first look assessment questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.triage.firstLookAssessments, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'firstLookAssessments', newQuestions));
  }

  return firstLookAssessment;
};

/**
 * Get ComplaintCategories for triage
 * Update metadata
 */
export const questionsComplaintCategory = (algorithm) => {
  const medicalCase = store.getState();
  const complaintCategories = [];
  const orders = algorithm.mobile_config.questions_orders[categories.complaintCategory];
  const { general_cc_id } = algorithm.config.basic_questions;

  const birthDate = medicalCase.nodes[algorithm.config.basic_questions.birth_date_question_id].value;
  const days = birthDate !== null ? moment().diff(birthDate, 'days') : 0;

  store.dispatch(setAnswer(algorithm, general_cc_id, Object.keys(algorithm.nodes[general_cc_id].answers)[0]));
  orders.forEach((order) => {
    if (medicalCase.nodes[order].id !== algorithm.config.basic_questions.general_cc_id) {
      // Differentiate complaint categories specific for neo_nat (<= 60 days) cases and others
      // For all questions that do not appear, set the answer to "No"
      if ((days <= 60 && algorithm.nodes[order].is_neonat) || (days > 60 && !algorithm.nodes[order].is_neonat)) {
        complaintCategories.push(medicalCase.nodes[order]);
      } else {
        store.dispatch(setAnswer(algorithm, order, Object.keys(algorithm.nodes[order].answers)[1]));
      }
    }
  });
  const newQuestions = complaintCategories.map(({ id }) => id);

  // Update state$ complaint categories questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.triage.complaintCategories, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'complaintCategories', newQuestions));
  }

  return complaintCategories;
};

/**
 * Get Basic Measurements for triage
 * Update metadata
 */
export const questionsBasicMeasurements = (algorithm) => {
  const medicalCase = store.getState();
  const basicMeasurements = [];

  const orderedQuestions = algorithm.mobile_config.questions_orders[categories.basicMeasurement];

  if (orderedQuestions !== undefined) {
    orderedQuestions.forEach((orderedQuestion) => {
      const question = medicalCase.nodes[orderedQuestion];
      if (questionIsDisplayedInTriage(medicalCase, question)) {
        basicMeasurements.push(question);
      }
    });
  }

  const newQuestions = basicMeasurements.map(({ id }) => id);

  // Update state$ basic measurements questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.triage.basicMeasurements, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'basicMeasurements', newQuestions));
  }

  return basicMeasurements;
};

/**
 * Get questions for Test
 * Update metadata
 */
export const questionsTests = (algorithm) => {
  const medicalCase = store.getState();
  let assessmentTest = [];

  assessmentTest = nodeFilterBy(medicalCase, algorithm, [
    {
      by: 'category',
      operator: 'equal',
      value: categories.assessment,
    },
  ]);

  const newQuestions = assessmentTest.map(({ id }) => id);

  // Update state$ tests questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.tests.tests, newQuestions)) {
    store.dispatch(updateMetaData('tests', 'tests', newQuestions));
  }

  return assessmentTest;
};

/**
 * Get questions for health cares
 * @param algorithm
 * @returns {*}
 */
export const questionsHealthCares = (algorithm) => {
  const medicalCase = store.getState();

  const healthCares = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.drug,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.management,
      },
    ],
    'OR',
    'array',
    true
  );

  return healthCares;
};
