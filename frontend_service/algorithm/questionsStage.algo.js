import * as _ from 'lodash';

import { store } from '../store';
import { categories } from '../constants';
import { updateMetaData } from '../actions/creators.actions';
import { calculateCondition } from './conditionsHelpers.algo';
import moment from "moment";

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
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.vitalSignAnthropometric,
      },
    ],
    diagnostics,
    'OR',
    'array',
    true
  );

  const vitalSignsQuestions = state$.nodes.filterBy(
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

  const questions = medicalHistoryQuestions.concat(vitalSignsQuestions);
  const newQuestions = questions.map(({ id }) => id);

  // Update state$ medical history questions if it's different from new questions list
  if (!_.isEqual(state$.metaData.consultation.medicalHistory, newQuestions)) {
    store.dispatch(updateMetaData('consultation', 'medicalHistory', newQuestions));
  }

  return questions;
};

/**
 * Get physical Exam for consultation
 * Update metadata
 */
export const questionsPhysicalExam = () => {
  const state$ = store.getState();
  const { diagnostics } = state$;
  const questions = state$.nodes.filterBy(
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

  const newQuestions = questions.map(({ id }) => id);

  // Update state$ physical exam questions if it's different from new questions list
  if (!_.isEqual(state$.metaData.consultation.physicalExam, newQuestions)) {
    store.dispatch(updateMetaData('consultation', 'physicalExam', newQuestions));
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

  const ordersFirstLookAssessment = state$.mobile_config.questions_orders[categories.emergencySign];

  if (ordersFirstLookAssessment !== undefined) {
    ordersFirstLookAssessment.map((order) => {
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

  const birthDate = state$.nodes[state$.config.basic_questions.birth_date_question_id].value;
  const days = birthDate !== null ? moment().diff(birthDate, 'days') : 0;

  orders.map((order) => {
    if (state$.nodes[order].id !== state$.config.basic_questions.general_cc_id) {
      if (days <= 60) {
        if (state$.nodes[order].is_neonat) {
          complaintCategories.push(state$.nodes[order]);
        } else {
          Object.keys(state$.nodes[order].answers).forEach((possibleAnswer) => {
            if (state$.nodes[order].answers[possibleAnswer].label === 'No') {
              state$.nodes[order].answer = parseInt(possibleAnswer);
            }
          });
        }
      } else {
        if (!state$.nodes[order].is_neonat) {
          complaintCategories.push(state$.nodes[order]);
        } else {
          Object.keys(state$.nodes[order].answers).forEach((possibleAnswer) => {
            if (state$.nodes[order].answers[possibleAnswer].label === 'No') {
              state$.nodes[order].answer = parseInt(possibleAnswer);
            }
          });
        }
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
    orderedQuestions.map((orderedQuestion) => {
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
  Object.keys(diagnoses.additional).map((id) => {
    Object.keys(diagnoses.additional[id].managements).map((m) => {
      if (calculateCondition(diagnoses.additional[id].managements[m]) === true) {
        isPossible = true;
      }
    });
  });

  Object.keys(diagnoses.proposed).map((id) => {
    Object.keys(diagnoses.proposed[id].managements).map((m) => {
      if (calculateCondition(diagnoses.proposed[id].managements[m]) === true) {
        isPossible = true;
      }
    });
  });

  return isPossible;
};

/**
 * Get drugs from 3 objects and return one object (manual merging)
 * Object from :
 * - Proposed
 * - Additional
 *
 * @return : object list all drugs
 *
 */
// TODO: Move it in final diagnostic models
export const getDrugs = (diagnoses = null) => {
  let currentDiagnoses;
  let currentAdditionalDrugs;

  if (diagnoses === null) {
    const state$ = store.getState();
    currentDiagnoses = state$.diagnoses;
    currentAdditionalDrugs = state$.diagnoses.additionalDrugs;
  } else {
    currentDiagnoses = diagnoses;
    currentAdditionalDrugs = diagnoses.additionalDrugs;
  }

  const drugs = {};

  const doubleString = ['proposed', 'additional'];

  doubleString.map((iteration) => {
    Object.keys(currentDiagnoses[iteration]).map((diagnoseId) => {
      // If diagnoses selected or additional (auto selected)
      if (currentDiagnoses[iteration][diagnoseId].agreed === true || iteration === 'additional') {
        // Iterate over drugs
        Object.keys(currentDiagnoses[iteration][diagnoseId].drugs).map((drugId) => {
          if (currentDiagnoses[iteration][diagnoseId].drugs[drugId].agreed === true && calculateCondition(currentDiagnoses[iteration][diagnoseId].drugs[drugId]) === true) {
            if (drugs[drugId] === undefined) {
              // New one so add it
              drugs[drugId] = currentDiagnoses[iteration][diagnoseId]?.drugs[drugId];
              drugs[drugId].diagnoses = [{ id: diagnoseId, type: iteration }];
            } else {
              // Already exist, manage it
              drugs[drugId].diagnoses.push({ id: diagnoseId, type: iteration });
              if (currentDiagnoses[iteration][diagnoseId]?.drugs[drugId].duration > drugs[drugId].duration) {
                drugs[drugId].duration = currentDiagnoses[iteration][diagnoseId]?.drugs[drugId].duration;
              }
            }
          }
        });
      }
    });
  });

  // Iterate over manually added drugs
  Object.keys(currentAdditionalDrugs).map((ky) => {
    if (drugs[ky] === undefined) {
      // New one so add it
      drugs[ky] = currentAdditionalDrugs[ky];
      drugs[ky].diagnoses = [null];
    } else {
      // Already exist, manage it
      drugs[ky].diagnoses.push(null);
    }
  });

  return drugs;
};
