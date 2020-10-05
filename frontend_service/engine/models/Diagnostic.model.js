// @flow

import { store } from '../../store';
import { questionBooleanValue } from './Question.model';

/**
 * Tests if diagnostic is excluded by the complaint category
 * @param nodes - All nodes, it's passed because I don't have access to state in the model
 * @returns {boolean}
 */
// TODO: FIXE COMMENT
export const diagnosticIsExcludedByComplaintCategory = (algorithm, diagnosticId, medicalCase = store.getState()) => {
  const complaintCategory = algorithm.diagnostics[diagnosticId].complaint_category;
  // TODO: FIXE THIS SHITTTT
  // console.log(medicalCase);
  // console.log(medicalCase.nodes[complaintCategory])
  return questionBooleanValue(algorithm, medicalCase.nodes[complaintCategory]) === false;
};
