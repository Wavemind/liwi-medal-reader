import { store } from '../store';
import { categories } from '../constants';
import { updateMetaData } from '../actions/creators.actions';

/**
 * This file contains methods to filter questions to each stages / steps
 */

/**
 * Get Medical History for consultation
 * Update metadata
 */
export const questionsMedicalHistory = () => {
  const state$ = store.getState();
  const questions = state$.nodes.filterBy(
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
        value: categories.vitalSignTriage,
      },
    ],
    'OR',
    'array',
    false
  );
  if (state$.metaData.consultation.medicalHistory.length === 0 && questions.length !== 0) {
    store.dispatch(
      updateMetaData(
        'consultation',
        'medicalHistory',
        questions.map(({ id }) => id)
      )
    );
  }
  return questions;
};

/**
 * Get physical Exam for consultation
 * Update metadata
 */
export const questionsPhysicalExam = () => {
  const state$ = store.getState();
  const questions = state$.nodes.filterBy(
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.physicalExam,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.other,
      },
    ],
    'OR',
    'array',
    false
  );

  if (state$.metaData.consultation.physicalExam.length === 0 && questions.length !== 0) {
    store.dispatch(
      updateMetaData(
        'consultation',
        'physicalExam',
        questions.map(({ id }) => id)
      )
    );
  }

  return questions;
};

/**
 * Get FirstLook Assessement for triage
 * Update metadata
 */
export const questionsFirstLookAssessement = () => {
  const state$ = store.getState();
  const firstLookAssessement = [];

  const ordersFirstLookAssessment = state$.triage.orders[categories.emergencySign];
  ordersFirstLookAssessment.map((order) => {
    firstLookAssessement.push(state$.nodes[order]);
  });

  if (state$.metaData.triage.firstLookAssessments.length === 0 && firstLookAssessement.length !== 0) {
    store.dispatch(
      updateMetaData(
        'triage',
        'firstLookAssessments',
        firstLookAssessement.map(({ id }) => id)
      )
    );
  }

  return firstLookAssessement;
};

/**
 * Get ComplaintCategory for triage
 * Update metadata
 */
export const questionsComplaintCategory = () => {
  const state$ = store.getState();
  const complaintCategory = [];
  const orders = state$.triage.orders[categories.complaintCategory];

  orders.map((order) => {
    complaintCategory.push(state$.nodes[order]);
  });

  if (state$.metaData.triage.complaintCategories.length === 0 && complaintCategory.length !== 0) {
    store.dispatch(
      updateMetaData(
        'triage',
        'complaintCategories',
        complaintCategory.map(({ id }) => id)
      )
    );
  }

  return complaintCategory;
};

/**
 * Get Basic Measurements for triage
 * Update metadata
 */
export const questionsBasicMeasurements = () => {
  const state$ = store.getState();
  const basicMeasurements = [];

  const orderedQuestions = state$.triage.orders[categories.vitalSignTriage];
  orderedQuestions.map((orderedQuestion) => {
    const question = state$.nodes[orderedQuestion];
    if (question.isDisplayedInTriage(state$)) {
      basicMeasurements.push(question);
    }
  });

  // Set Questions in State for validation
  if (state$.metaData.triage.basicMeasurements.length === 0 && basicMeasurements.length !== 0) {
    store.dispatch(
      updateMetaData(
        'triage',
        'basicMeasurements',
        basicMeasurements.map(({ id }) => id)
      )
    );
  }

  return basicMeasurements;
};

/**
 * Get questions for Test
 * Update metadata
 */
export const questionsTests = () => {
  const state$ = store.getState();
  let assessmentTest = [];
  assessmentTest = state$.nodes.filterBy([{ by: 'category', operator: 'equal', value: categories.assessment }]);

  if (state$.metaData.tests.tests.length === 0 && assessmentTest.length !== 0) {
    store.dispatch(
      updateMetaData(
        'tests',
        'tests',
        assessmentTest.map(({ id }) => id)
      )
    );
  }

  return assessmentTest;
};
