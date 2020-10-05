import { valueFormats } from '../constants';

export const generateQuestion = (node) => {
  const { answer = null, counter = 0, dd = [], df = [], qs = [], value = '', estimable = false, estimableValue = 'measured', validationMessage = null, validationType = null } = node;

  const hash = {
    ..._generateCommon(node),
    answer,
    counter,
    dd,
    df,
    qs,
    value,
    validationMessage,
    validationType,
  };

  // Add attribute for basic measurement question ex (weight, MUAC, height) to know if it's measured or estimated value answered
  if (estimable) {
    // Type available [measured, estimated]
    hash.estimableValue = estimableValue;
  }

  return hash;
};

export const generateQuestionsSequence = (node) => {
  const { answer = null, dd = [], qs = [], df = [] } = node;
  return {
    ..._generateCommon(node),
    answer,
    dd,
    df,
    qs,
  };
};

export const generateManagement = (node) => {
  return {
    ..._generateCommon(node),
    healthCareObject: 'managements',
  };
};

export const generateDrug = (node) => {
  const { formulationSelected = null } = node;

  return {
    ..._generateCommon(node),
    formulationSelected,
    healthCareObject: 'drugs',
  };
};

export const generateFinalDiagnostic = (node) => {
  return node;
};

const _generateCommon = (node) => {
  const { id, type, category } = node;
  return {
    id,
    type,
    category,
  };
};
