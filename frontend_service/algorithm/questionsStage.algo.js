import * as _ from 'lodash';

import moment from 'moment';
import { store } from '../store';
import { categories, stages } from '../constants';
import { updateMetaData, setAnswer } from '../actions/creators.actions';
import { nodeFilterBy } from '../helpers/Node.model';
import { questionBooleanValue, questionIsDisplayedInTriage } from '../helpers/Question.model';

/**
 * Removes questions if they are no longer needed
 * @param medicalCase
 * @param questionPerSystem
 * @param newQuestions
 * @param view
 * @returns {*}
 */
const removeQuestions = (medicalCase, questionPerSystem, newQuestions, view) => {
  const questionsToRemove = _.difference(medicalCase.metaData.consultation[view], newQuestions);

  if (questionsToRemove.length > 0) {
    return questionPerSystem.map((system) => {
      return { title: system.title, data: _.reject(system.data, (dataItem) => questionsToRemove.includes(dataItem.id)) };
    });
  }
  return questionPerSystem;
};

/**
 * Orders the questions in to the correct systems
 * @param medicalCase
 * @param answeredQuestionId
 * @param questions
 * @param questionPerSystem
 * @param systemOrders
 * @param algorithm
 * @param view
 * @returns {*}
 */
const orderQuestionsInSystems = (medicalCase, answeredQuestionId, questions, questionPerSystem, systemOrders, algorithm, view) => {
  if (medicalCase.metaData.consultation[view].length === 0) {
    questions.forEach((question) => {
      const index = questionPerSystem.findIndex((system) => system.title === String(question.system));
      // TODO: MUST BE REMOVED WHEN ALL SYSTEM IS SET FOR QUESTIONS
      if (index !== -1) {
        questionPerSystem[index].data.push(question);
      }
    });
  } else {
    const followUpQuestionsSystem = questionPerSystem.findIndex((system) => system.title === 'follow_up_questions');

    questions.forEach((question) => {
      const followUpQuestionIndex = questionPerSystem[followUpQuestionsSystem].data.findIndex((q) => q.id === question.id);

      // Add question in 'follow_up_questions' system if his question's system was already answered
      if (
        (medicalCase.metaData.consultation[view].length > 0 && medicalCase.metaData.consultation[view].includes(question.id) && followUpQuestionIndex === -1) ||
        (algorithm.nodes[answeredQuestionId]?.system !== undefined &&
          !medicalCase.metaData.consultation[view].includes(question.id) &&
          systemOrders.indexOf(question.system) >= systemOrders.indexOf(algorithm.nodes[answeredQuestionId].system))
      ) {
        const systemIndex = questionPerSystem.findIndex((system) => system.title === String(question.system));

        // TODO: MUST BE REMOVED WHEN ALL SYSTEM IS SET FOR QUESTIONS
        if (systemIndex !== -1) {
          const questionIndex = questionPerSystem[systemIndex].data.findIndex((q) => q.id === question.id);
          if (questionIndex !== -1) {
            questionPerSystem[systemIndex].data[questionIndex] = question;
          } else {
            questionPerSystem[systemIndex].data.push(question);
          }
        }
      } else {
        if (followUpQuestionIndex !== -1) {
          questionPerSystem[followUpQuestionsSystem].data[followUpQuestionIndex] = question;
        } else {
          questionPerSystem[followUpQuestionsSystem].data.push(question);
        }
      }
    });
  }
  return questionPerSystem;
};

/**
 * Dispatched new questions to store and returns sorted questions
 * @param questionPerSystem
 * @param medicalCase
 * @param newQuestions
 * @param view
 * @param viewQuestion
 * @returns {*}
 */
const dispatchToStore = (questionPerSystem, medicalCase, newQuestions, view, viewQuestion) => {
  if (!_.isEqual(medicalCase.metaData.consultation[viewQuestion], questionPerSystem)) {
    store.dispatch(updateMetaData('consultation', viewQuestion, questionPerSystem));
    // Used to validate step
    store.dispatch(updateMetaData('consultation', view, newQuestions));

    const filteredQuestions = questionPerSystem.filter((system) => system.data.length > 0);
    return sortQuestions(filteredQuestions);
  }

  const filteredQuestions = medicalCase.metaData.consultation[viewQuestion].filter((system) => system.data.length > 0);
  return sortQuestions(filteredQuestions);
};

/**
 * Get Referrals for Diagnosis
 * Update metadata
 */
export const questionsReferrals = (algorithm) => {
  const medicalCase = store.getState();
  const referralQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.referral,
      },
    ],
    'OR',
    'array',
    false
  );

  const newQuestions = referralQuestions.map(({ id }) => id);

  // Update state$ first look assessment questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.diagnosticsstrategy.referral, newQuestions)) {
    store.dispatch(updateMetaData('diagnosticsstrategy', 'referral', newQuestions));
  }

  return referralQuestions;
};

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
      {
        by: 'category',
        operator: 'equal',
        value: categories.backgroundCalculation,
      },
    ],
    'OR',
    'array',
    true
  );

  const systemOrders = algorithm.mobile_config.systems_order;

  let questionPerSystem = [];
  systemOrders.forEach((system) => {
    const data =
      medicalCase.metaData.consultation.medicalHistoryQuestions?.find((medicalHistoryQuestion) => {
        return medicalHistoryQuestion.title === system;
      })?.data || [];
    questionPerSystem.push({
      title: system,
      data: [...data],
    });
  });

  const newQuestions = medicalHistoryQuestions.map(({ id }) => id);

  questionPerSystem = orderQuestionsInSystems(medicalCase, answeredQuestionId, medicalHistoryQuestions, questionPerSystem, systemOrders, algorithm, 'medicalHistory', 'medicalHistoryQuestions');
  questionPerSystem = removeQuestions(medicalCase, questionPerSystem, newQuestions, 'medicalHistory');
  return dispatchToStore(questionPerSystem, medicalCase, newQuestions, 'medicalHistory', 'medicalHistoryQuestions');
};

/**
 * Get physical Exam for consultation
 * Update metadata
 */
export const questionsPhysicalExam = (algorithm, answeredQuestionId) => {
  const medicalCase = store.getState();
  const vitalSignQuestions = [];
  const backgroundCalculationQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.backgroundCalculation,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.backgroundCalculation,
      },
    ],
    'OR',
    'array',
    true
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

  // Get vital signs questions based on background calculation
  backgroundCalculationQuestions.forEach((bcQuestion) => {
    algorithm.nodes[bcQuestion.id].vital_signs.forEach((id) => {
      if (algorithm.nodes[id].category === categories.vitalSignAnthropometric) {
        vitalSignQuestions.push(medicalCase.nodes[id]);
      }
    });
  });

  const questions = vitalSignQuestions.concat(physicalExamQuestions);
  const systemOrders = algorithm.mobile_config.systems_order;

  let questionPerSystem = [];
  systemOrders.forEach((system) => {
    const data =
      medicalCase.metaData.consultation.physicalExamQuestions?.find((physicalExamQuestion) => {
        return physicalExamQuestion.title === system;
      })?.data || [];

    questionPerSystem.push({
      title: system,
      data: [...data],
    });
  });

  const newQuestions = questions.map(({ id }) => id);
  questionPerSystem = orderQuestionsInSystems(medicalCase, answeredQuestionId, questions, questionPerSystem, systemOrders, algorithm, 'physicalExam');
  questionPerSystem = removeQuestions(medicalCase, questionPerSystem, newQuestions, 'physicalExam');
  return dispatchToStore(questionPerSystem, medicalCase, newQuestions, 'physicalExam', 'physicalExamQuestions');
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
export const questionsUniqueTriageQuestion = (algorithm) => {
  const medicalCase = store.getState();
  const uniqueTriageQuestions = [];

  const ordersUniqueTriageQuestion = algorithm.mobile_config.questions_orders[categories.uniqueTriageQuestion];

  if (ordersUniqueTriageQuestion !== undefined) {
    ordersUniqueTriageQuestion.forEach((order) => {
      uniqueTriageQuestions.push(medicalCase.nodes[order]);
    });
  }

  const newQuestions = uniqueTriageQuestions.map(({ id }) => id);

  // Update state$ first look assessment questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.triage.uniqueTriageQuestion, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'uniqueTriageQuestion', newQuestions));
  }

  return uniqueTriageQuestions;
};

/**
 * Get ComplaintCategories for triage
 * Update metadata
 */
export const questionsComplaintCategory = (algorithm) => {
  const medicalCase = store.getState();
  const complaintCategories = [];
  const orders = algorithm.mobile_config.questions_orders[categories.complaintCategory];
  const birthDate = medicalCase.nodes[algorithm.config.basic_questions.birth_date_question_id].value;
  const days = birthDate !== null ? moment().diff(birthDate, 'days') : 0;

  orders.forEach((order) => {
    if (medicalCase.nodes[order].id !== algorithm.config.basic_questions.general_cc_id && medicalCase.nodes[order].id !== algorithm.config.basic_questions.yi_cc_general) {
      // Differentiate complaint categories specific for neo_nat (<= 60 days) cases and others
      // For all questions that do not appear, set the answer to "No"
      if ((days <= 60 && algorithm.nodes[order].is_neonat) || (days > 60 && !algorithm.nodes[order].is_neonat)) {
        complaintCategories.push(medicalCase.nodes[order]);
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
 * Get health cares
 * @param algorithm
 * @returns {*}
 */
export const healthCares = (algorithm) => {
  return _.filter(algorithm.nodes, (f) => f.category === categories.drug);
};

export const questionsRegistration = (algorithm) => {
  const medicalCase = store.getState();
  const registrationQuestions = [];
  const registrationOrder = algorithm.mobile_config.questions_orders['registration_step'];

  registrationOrder.forEach((order) => {
    registrationQuestions.push(medicalCase.nodes[order]);
  });

  const newQuestions = registrationQuestions.map(({ id }) => id);

  // Update state$ tests questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.patientupsert.custom, newQuestions)) {
    store.dispatch(updateMetaData('patientupsert', 'custom', newQuestions));
  }

  return registrationQuestions;
};
