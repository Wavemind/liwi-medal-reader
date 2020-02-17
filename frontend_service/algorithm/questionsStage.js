import { store } from '../store';
import { categories } from '../constants';
import { updateMetaData } from '../actions/creators.actions';

/**
 * This file contains methods to filter questions to each stages / steps
 */

// Medical history questions

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
    store.dispatch(updateMetaData('consultation', 'medicalHistory', questions.map(({ id }) => id)));
  }
  return questions;
};

// Phisical exam questions
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
    store.dispatch(updateMetaData('consultation', 'physicalExam', questions.map(({ id }) => id)));
  }

  return questions;
};

export const questionsFirstLookAssessement = () => {
  const state$ = store.getState();
  let firstLookAssessement = [];

  const ordersFirstLookAssessment = state$.triage.orders[categories.emergencySign];
  ordersFirstLookAssessment.map((order) => {
    firstLookAssessement.push(state$.nodes[order]);
  });

  if (state$.metaData.triage.firstLookAssessments.length === 0 && firstLookAssessement.length !== 0) {
    store.dispatch(updateMetaData('triage', 'firstLookAssessments', firstLookAssessement.map(({ id }) => id)));
  }

  return firstLookAssessement;
};

export const questionsComplaintCategory = () => {
  const state$ = store.getState();
  let complaintCategory = [];
  const orders = state$.triage.orders[categories.complaintCategory];

  orders.map((order) => {
    complaintCategory.push(state$.nodes[order]);
  });

  if (state$.metaData.triage.complaintCategories.length === 0 && complaintCategory.length !== 0) {
    store.dispatch(updateMetaData('triage', 'complaintCategories', complaintCategory.map(({ id }) => id)));
  }

  return complaintCategory;
};

export const questionsBasicMeasurements = () => {
  const state$ = store.getState();
  let basicMeasurements = [];

  const orderedQuestions = state$.triage.orders[categories.vitalSignTriage];
  orderedQuestions.map((orderedQuestion) => {
    let question = state$.nodes[orderedQuestion];
    if (question.isDisplayedInTriage(state$)) {
      basicMeasurements.push(question);
    }
  });

  // Set Questions in State for validation
  if (state$.metaData.triage.basicMeasurements.length === 0 && basicMeasurements.length !== 0) {
    store.dispatch(updateMetaData('triage', 'basicMeasurements', basicMeasurements.map(({ id }) => id)));
  }

  return basicMeasurements;
};

export const questionsTests = () => {
  const state$ = store.getState();
  let assessmentTest = [];
  assessmentTest = state$.nodes.filterBy([{ by: 'category', operator: 'equal', value: categories.assessment }]);

  if (state$.metaData.tests.tests.length === 0 && assessmentTest.length !== 0) {
    store.dispatch(updateMetaData('tests', 'tests', assessmentTest.map(({ id }) => id)));
  }

  return assessmentTest;
};
