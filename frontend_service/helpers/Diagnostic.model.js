// @flow
import { questionBooleanValue } from './Question.model';

/**
 * Tests if diagnostic is excluded by the complaint category
 * @param algorithm
 * @param diagnosticId
 * @param medicalCase
 * @returns {boolean}
 */
export const diagnosticIsExcludedByComplaintCategory = (algorithm, diagnosticId, medicalCase) => {
  const complaintCategory = algorithm.diagnostics[diagnosticId].complaint_category;
  return questionBooleanValue(algorithm, medicalCase.nodes[complaintCategory]) === false;
};
