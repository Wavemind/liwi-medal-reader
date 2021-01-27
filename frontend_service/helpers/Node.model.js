// @flow
import NavigationService from 'engine/navigation/Navigation.service';
import React from 'react';
import findKey from 'lodash/findKey';
import _ from 'lodash';

import { categories, valueFormats } from '../constants';

/**
 * Update the answer based node's on value format
 * @param value
 * @param algorithm
 * @param mcNode
 * @returns {{answer: null, validationMessage: null, validationType: null, answer_stage: string, value: *}}
 */
export const nodeUpdateAnswer = (value, algorithm, mcNode) => {
  let answer = null;
  let validationMessage = null;
  let validationType = null;

  const currentNode = algorithm.nodes[mcNode.id];

  switch (currentNode.value_format) {
    case valueFormats.int:
    case valueFormats.float:
      if (value === null) {
        answer = value;
      } else if (mcNode.unavailableValue && (currentNode.category === categories.basicMeasurement || currentNode.category === categories.vitalSignAnthropometric)) {
        // Unavailable question
        answer = Number(value);
        value = currentNode.answers[answer].value;
      } else {
        // Normal process
        answer = findKey(currentNode.answers, (answerCondition) => {
          switch (answerCondition.operator) {
            case 'more_or_equal':
              return value >= Number(answerCondition.value);
            case 'less':
              return value < Number(answerCondition.value);
            case 'between':
              return value >= Number(answerCondition.value.split(',').first()) && value < Number(answerCondition.value.split(',').second());
          }
        });
        if (answer !== undefined) {
          answer = Number(answer);
        } else {
          answer = null;
        }
      }
      break;
    case valueFormats.string:
    case valueFormats.date:
      //  Nothing to do
      break;
    case valueFormats.bool:
    case valueFormats.array:
    case valueFormats.present:
    case valueFormats.positive:
      // Set Number only if this is a number
      if (value === null) {
        // Set the new answer to null for reset
        answer = value;
      } else if (/^\d+$/.test(value)) {
        answer = Number(value);
        value = currentNode.answers[answer].value;
      } else {
        answer = Object.keys(currentNode.answers).find((currentNodeAnswerId) => currentNode.answers[currentNodeAnswerId].value === value);
      }
      break;
    default:
      // eslint-disable-next-line no-console
      if (__DEV__) {
        console.log('%c --- DANGER --- ', 'background: #FF0000; color: #F6F3ED; padding: 5px', `Unhandled question format ${currentNode.value_format}`, currentNode);
      }
      if (value !== null) {
        answer = Number(value);
      } else {
        // Set the new answer to null for reset
        answer = value;
      }
      break;
  }

  // Validation for integer and float type based on medAL-creator config
  if ((currentNode.value_format === valueFormats.int || currentNode.value_format === valueFormats.float) && !mcNode.unavailableValue) {
    if (value !== null && (value < currentNode.min_value_warning || value > currentNode.max_value_warning)) {
      // Warning
      if (value < currentNode.min_value_warning && currentNode.min_value_warning !== null) {
        validationMessage = currentNode.min_message_warning;
      }

      if (value > currentNode.max_value_warning && currentNode.max_value_warning !== null) {
        validationMessage = currentNode.max_message_warning;
      }

      validationType = 'warning';

      // Error
      if (currentNode.min_value_error !== null || currentNode.max_value_error !== null) {
        if (value < currentNode.min_value_error || value > currentNode.max_value_error) {
          if (value < currentNode.min_value_error && currentNode.min_value_error !== null) {
            validationMessage = currentNode.min_message_error;
          }

          if (value > currentNode.max_value_error && currentNode.max_value_error !== null) {
            validationMessage = currentNode.max_message_error;
          }
          validationType = 'error';
        }
      }
    } else {
      validationMessage = null;
      validationType = null;
    }
  }

  // Assign final value
  return {
    answer,
    value,
    answer_stage: NavigationService.getCurrentRoute().routeName,
    validationMessage,
    validationType,
  };
};

/**
 * Filter by type property
 * @param nodes
 * @param type
 * @returns {string[]}
 */
export const nodeFilterByType = (nodes, type) => {
  return _.filter(nodes, (n) => n.type === type);
};

/**
 * Filtered nodes on multiple params
 * @param medicalCase
 * @param algorithm
 * @param filters
 * @param operator
 * @param formatReturn
 * @param counter
 * @returns {*}
 */
export const nodeFilterBy = (medicalCase, algorithm, filters, operator = 'OR', formatReturn = 'array', counter = true) => {
  // return the boolean for one filter
  const switchTest = (filter, node) => {
    switch (filter.operator) {
      case 'equal':
        return algorithm.nodes[node.id][filter.by] === filter.value;
      case 'more':
        return algorithm.nodes[node.id][filter.by] > filter.value;
    }
  };

  const counterFilter = (filter, node) => {
    if (counter) {
      return switchTest(filter, node) && node.counter > 0;
    }
    return switchTest(filter, node);
  };

  const { nodes } = medicalCase;

  let methodFilteringLodash;

  // Set the right method depending the return format
  if (formatReturn === 'array') {
    // Return new array
    methodFilteringLodash = 'filter';
  } else if (formatReturn === 'object') {
    // Return object and keep key
    methodFilteringLodash = 'pickBy';
  }

  return _[methodFilteringLodash](nodes, (node) => {
    // The some() method tests whether at least one element in the array passes the test implemented by the provided function.
    // It returns a Boolean value.
    return filters.some((filter) => {
      return counterFilter(filter, node);
    });
  });
};
