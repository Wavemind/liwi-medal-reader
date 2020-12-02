import * as _ from 'lodash';

import moment from 'moment';
import { store } from '../store';
import { categories, stages, systemsOrder } from '../constants';
import { updateMetaData, setAnswer } from '../actions/creators.actions';
import { nodeFilterBy } from '../helpers/Node.model';
import { questionBooleanValue, questionIsDisplayedInTriage } from '../helpers/Question.model';

/**
 * Get Medical History for consultation
 * Update metadata
 */
export const questionsMedicalHistory = (algorithm, answeredQuestionId) => {
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

  const systemOrders = algorithm.mobile_config.systems_order;

  const questionPerSystem = [];
  systemOrders.forEach((system) => {
    questionPerSystem.push({
      title: system,
      data: [],
    });
  });

  questionPerSystem.push({
    title: 'follow_up_questions',
    data: [],
  });

  questionPerSystem.push({
    title: 'null',
    data: [],
  });

  if (medicalCase.metaData.consultation.medicalHistory.length === 0 || algorithm.nodes[answeredQuestionId]?.system === undefined) {
    medicalHistoryQuestions.forEach((question) => {
      const index = questionPerSystem.findIndex((system) => system.title === String(question.system));
      questionPerSystem[index].data.push(question);
    });
  } else {
    medicalHistoryQuestions.forEach((question) => {
      // Add question in 'follow_up_questions' system if his question's system was already answered
      if (
        (medicalCase.metaData.consultation.medicalHistory.length > 0 && medicalCase.metaData.consultation.medicalHistory.includes(question.id)) ||
        (algorithm.nodes[answeredQuestionId]?.system !== undefined &&
          !medicalCase.metaData.consultation.medicalHistory.includes(question.id) &&
          systemOrders.indexOf(question.system) >= systemOrders.indexOf(algorithm.nodes[answeredQuestionId].system))
      ) {
        const index = questionPerSystem.findIndex((system) => system.title === String(question.system));
        questionPerSystem[index].data.push(question);
      } else {
        const index = questionPerSystem.findIndex((system) => system.title === 'follow_up_questions');
        questionPerSystem[index].data.push(question);
      }
    });
  }

  if (!_.isEqual(medicalCase.metaData.consultation.medicalHistory, questionPerSystem)) {
    store.dispatch(updateMetaData('consultation', 'medicalHistoryQuestions', questionPerSystem));

    const filteredMedicalHistory = questionPerSystem.filter((system) => system.data.length > 0);
    return sortQuestions(filteredMedicalHistory);
  }

  const filteredMedicalHistory = medicalCase.metaData.consultation.medicalHistoryQuestions.filter((system) => system.data.length > 0);
  return sortQuestions(filteredMedicalHistory);
};

/**
 * Get physical Exam for consultation
 * Update metadata
 */
export const questionsPhysicalExam = (algorithm, answeredQuestionId) => {
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

  const systemOrders = algorithm.mobile_config.systems_order;

  const questionPerSystem = [];
  systemOrders.forEach((system) => {
    questionPerSystem.push({
      title: system,
      data: [],
    });
  });

  questionPerSystem.push({
    title: 'follow_up_questions',
    data: [],
  });

  questionPerSystem.push({
    title: 'null',
    data: [],
  });

  if (medicalCase.metaData.consultation.physicalExam.length === 0 || algorithm.nodes[answeredQuestionId]?.system === undefined) {
    physicalExamQuestions.forEach((question) => {
      const index = questionPerSystem.findIndex((system) => system.title === String(question.system));
      questionPerSystem[index].data.push(question);
    });
  } else {
    physicalExamQuestions.forEach((question) => {
      // Add question in 'follow_up_questions' system if his question's system was already answered
      if (
        (medicalCase.metaData.consultation.physicalExam.length > 0 && medicalCase.metaData.consultation.physicalExam.includes(question.id)) ||
        (algorithm.nodes[answeredQuestionId]?.system !== undefined &&
          !medicalCase.metaData.consultation.physicalExam.includes(question.id) &&
          systemOrders.indexOf(question.system) >= systemOrders.indexOf(algorithm.nodes[answeredQuestionId].system))
      ) {
        const index = questionPerSystem.findIndex((system) => system.title === String(question.system));
        questionPerSystem[index].data.push(question);
      } else {
        const index = questionPerSystem.findIndex((system) => system.title === 'follow_up_questions');
        questionPerSystem[index].data.push(question);
      }
    });
  }

  if (!_.isEqual(medicalCase.metaData.consultation.physicalExamQuestions, questionPerSystem)) {
    store.dispatch(updateMetaData('consultation', 'physicalExamQuestions', questionPerSystem));

    const filteredQuestionPerSystem = questionPerSystem.filter((system) => system.data.length > 0);
    return sortQuestions(filteredQuestionPerSystem);
  }

  const filteredQuestionPerSystem = medicalCase.metaData.consultation.physicalExamQuestions.filter((system) => system.data.length > 0);
  return sortQuestions(filteredQuestionPerSystem);
};

/**
 * Sorts the array of question
 * @param questionsPerSystem - Array to sort
 * @returns {*} - Sorted array
 */
const sortQuestions = (questionsPerSystem) => {
  return questionsPerSystem.map((system) => {
    system.data.sort((a, b) => {
      if (a.is_danger_sign === b.is_danger_sign || a?.emergency_status === b?.emergency_status) return 0;
      if (a.is_danger_sign === true || a?.emergency_status === 'referral') return -1;
      return 1;
    });
    return system;
  });
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
      const mcNode = medicalCase.nodes[orderedQuestion];
      const currentNode = algorithm.nodes[orderedQuestion];

      // Main target -> exclude YI questions
      const isExcludedByComplaintCategory = currentNode.conditioned_by_cc.some((complaintCategory) => {
        return questionBooleanValue(algorithm, medicalCase.nodes[complaintCategory]) === false;
      });

      if (questionIsDisplayedInTriage(medicalCase, mcNode) && !isExcludedByComplaintCategory) {
        basicMeasurements.push(mcNode);
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

  assessmentTest = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.assessment,
      },
    ],
    'OR',
    'array',
    !algorithm.is_arm_control
  );

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

export const questionsRegistration = (algorithm) => {
  const medicalCase = store.getState();

  // Get nodes to display in registration stage
  const registrationQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'stage',
        operator: 'equal',
        value: stages.registration,
      },
    ],
    'OR',
    'array',
    false
  );

  const newQuestions = registrationQuestions.map(({ id }) => id);

  // Update state$ tests questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.patientupsert.custom, newQuestions)) {
    store.dispatch(updateMetaData('patientupsert', 'custom', newQuestions));
  }

  return registrationQuestions;
};
