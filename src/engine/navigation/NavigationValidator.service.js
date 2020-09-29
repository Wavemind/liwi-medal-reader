import React from 'react';
import _ from 'lodash';
import { valueFormats } from '../../../frontend_service/constants';
import { store } from '../../../frontend_service/store';
import i18n from '../../utils/i18n';

import {
  questionsBasicMeasurements,
  questionsComplaintCategory,
  questionsFirstLookAssessement,
  questionsMedicalHistory,
  questionsPhysicalExam,
  questionsTests,
} from '../../../frontend_service/algorithm/questionsStage.algo';

const screens = [
  { key: 'Home' },
  {
    key: 'PatientUpsert',
    medicalCaseOrder: 0,
    validations: {
      custom: { is_mandatory: true },
    },
  },
  {
    key: 'Triage',
    medicalCaseOrder: 1,
    validations: {
      firstLookAssessments: { is_mandatory: true, initialPage: 0 },
      complaintCategories: { answer: 'not_null', initialPage: 1 },
      basicMeasurements: { is_mandatory: true, initialPage: 2 },
    },
    generateQuestions: [questionsFirstLookAssessement, questionsComplaintCategory, questionsBasicMeasurements],
  },
  {
    key: 'Consultation',
    medicalCaseOrder: 2,
    validations: {
      medicalHistory: { is_mandatory: true, initialPage: 0 },
      physicalExam: { is_mandatory: true, initialPage: 1 },
      comment: { initialPage: 2 },
    },
    generateQuestions: [questionsPhysicalExam, questionsMedicalHistory],
  },
  {
    key: 'Tests',
    medicalCaseOrder: 3,
    validations: { tests: { is_mandatory: true, initialPage: 0 } },
    generateQuestions: [questionsTests],
  },
  {
    key: 'DiagnosticsStrategy',
    medicalCaseOrder: 4,
    validations: {},
  },
];

export const modelValidator = {
  isActionValid: true,
  routeRequested: null,
  stepToBeFill: [],
  screenToBeFill: [],
  questionsToBeFill: [],
  customErrors: [],
  mustFinishStage: false,
};

/**
 * Return the validation for the given step
 *
 * @param route : route from navigation
 * @param lastState : lastState from state navigation
 * @param validator : object contain all validation
 * @return validator : may be updated in the function
 */
export const validatorStep = (route, lastState, validator) => {
  const state$ = store.getState();
  if (route?.params?.initialPage && route.params.initialPage > 0) {
    const detailSetParamsRoute = screens.find((s) => s.key === route.routeName);
    const detailValidation = _.findKey(detailSetParamsRoute.validations, (v) => v.initialPage === route.params.initialPage - 1);

    if (detailValidation !== undefined) {
      const questionsToValidate = state$.metaData[route.routeName.toLowerCase()];
      const questions = questionsToValidate[detailValidation];
      const criteria = detailSetParamsRoute.validations[detailValidation];
      validator = oneValidation(criteria, questions, detailValidation);
    }
  }

  return validator;
};

/**
 * Return one validation inside an stage
 * ex : Step firstLookAssessments
 *
 * @param criteria : object from the constant screens
 * @param questions : questions used to validation
 * @param stepName : stepName : step to validate
 * @return {validator} :
 */
function oneValidation(criteria, questions, stepName) {
  const medicalCase = store.getState();
  let result;
  let isValid = true;
  // Break Ref JS
  const staticValidator = JSON.parse(JSON.stringify(modelValidator));
  staticValidator.stepName = stepName;
  console.log(criteria);
  Object.keys(criteria).map((c) => {
    switch (c) {
      case 'is_mandatory':
        questions.forEach((questionId) => {
          const node = medicalCase.nodes[questionId];
          if (node.is_mandatory === true) {
            result = node.answer !== null || node.value !== null;

            if (!result) {
              isValid = false;
              staticValidator.questionsToBeFill.push(node);
            }
          }
          console.log(node);
          // Test integer or float question if there is validation
          if (node.value_format === valueFormats.int || node.value_format === valueFormats.float) {
            if (node.value !== null && (node.min_value_error !== null || node.max_value_error) && (node.value < node.min_value_error || node.value > node.max_value_error)) {
              isValid = false;
              staticValidator.questionsToBeFill.push(node);
            }
          }
        });
        break;
      case 'answer':
        if (criteria[c] === 'not_null') {
          questions.forEach((questionId) => {
            const node = medicalCase.nodes[questionId];
            result = node.answer !== null;
            if (!result) {
              isValid = false;
              staticValidator.questionsToBeFill.push(node);
            }
          });
        }
        break;
      default:
        break;
    }
  });
  // Need all condition to true
  staticValidator.isActionValid = isValid;
  return staticValidator;
}

/**
 * Validate full stage
 * @param navigateRoute : {currentStage, nextStage, params}
 * @return {any}
 */
export const validatorNavigate = (navigateRoute) => {
  const validator = JSON.parse(JSON.stringify(modelValidator));
  const medicalCase = store.getState();

  // TODO Clean validation of custom fields it's very gross !
  if (navigateRoute.currentStage === 'PatientUpsert') {
    if (medicalCase.consent === null) {
      validator.isActionValid = false;
      validator.customErrors.push(i18n.t('consent_image:required'));
      return validator;
    }
  }

  const screenSchema = screens.find((s) => s.key === navigateRoute.currentStage);

  // Questions to be validated
  const questionsToValidate = medicalCase.metaData[screenSchema.key.toLowerCase()];

  const stepsResult = Object.keys(screenSchema.validations).map((validation) => {
    console.log('je rentre la?');
    const questions = questionsToValidate[validation];
    const criteria = screenSchema.validations[validation];
    return oneValidation(criteria, questions, validation);
  });

  // All step need to be valid
  validator.isActionValid = stepsResult.every((c) => c.isActionValid === true);
  validator.stepToBeFill = stepsResult;

  if (!validator.isActionValid) {
    validator.routeRequested = navigateRoute.currentStage;
    validator.screenToBeFill = screenSchema.key;
  }
  return validator;
};
