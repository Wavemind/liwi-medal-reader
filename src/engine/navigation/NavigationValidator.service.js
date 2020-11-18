import React from 'react';
import _ from 'lodash';
import { valueFormats } from '../../../frontend_service/constants';
import { store } from '../../../frontend_service/store';
import i18n from '../../utils/i18n';

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
      // firstLookAssessments: { is_mandatory: true, initialPage: 0 },
      complaintCategories: { answer: 'not_null', initialPage: 0 },
      basicMeasurements: { is_mandatory: true, initialPage: 1 },
    },
  },
  {
    key: 'Consultation',
    medicalCaseOrder: 2,
    validations: {
      medicalHistory: { is_mandatory: true, initialPage: 0 },
      physicalExam: { is_mandatory: true, initialPage: 1 },
      comment: { initialPage: 2 },
    },
  },
  {
    key: 'Tests',
    medicalCaseOrder: 3,
    validations: { tests: { is_mandatory: true, initialPage: 0 } },
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
export const validatorStep = (algorithm, route, lastState, validator) => {
  const state$ = store.getState();
  if (route?.params?.initialPage && route.params.initialPage > 0) {
    const detailSetParamsRoute = screens.find((s) => s.key === route.routeName);
    const detailValidation = _.findKey(detailSetParamsRoute.validations, (v) => v.initialPage === route.params.initialPage - 1);

    if (detailValidation !== undefined) {
      const questionsToValidate = state$.metaData[route.routeName.toLowerCase()];
      const questions = questionsToValidate[detailValidation];
      const criteria = detailSetParamsRoute.validations[detailValidation];
      validator = oneValidation(algorithm, criteria, questions, detailValidation);
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
function oneValidation(algorithm, criteria, questions, stepName) {
  const medicalCase = store.getState();
  let result;
  let isValid = true;
  // Break Ref JS
  const staticValidator = JSON.parse(JSON.stringify(modelValidator));
  staticValidator.stepName = stepName;

  Object.keys(criteria).map((c) => {
    switch (c) {
      case 'is_mandatory':
        questions.forEach((questionId) => {
          const mcNode = medicalCase.nodes[questionId];
          const currentNode = algorithm.nodes[questionId];
          if (currentNode.is_mandatory === true) {
            result = mcNode.answer !== null || mcNode.value !== null;

            if (!result) {
              isValid = false;
              staticValidator.questionsToBeFill.push(currentNode);
            }
          }

          // Test integer or float question if there is validation
          if (mcNode.value_format === valueFormats.int || mcNode.value_format === valueFormats.float) {
            if (mcNode.value !== null && (mcNode.min_value_error !== null || mcNode.max_value_error) && (mcNode.value < mcNode.min_value_error || mcNode.value > mcNode.max_value_error)) {
              isValid = false;
              staticValidator.questionsToBeFill.push(currentNode);
            }
          }
        });
        break;
      case 'answer':
        if (criteria[c] === 'not_null') {
          questions.forEach((questionId) => {
            const mcNode = medicalCase.nodes[questionId];
            const currentNode = algorithm.nodes[questionId];
            result = mcNode.answer !== null;
            if (!result) {
              isValid = false;
              staticValidator.questionsToBeFill.push(currentNode);
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
export const validatorNavigate = (algorithm, navigateRoute) => {
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
    const questions = questionsToValidate[validation];
    const criteria = screenSchema.validations[validation];
    return oneValidation(algorithm, criteria, questions, validation);
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
