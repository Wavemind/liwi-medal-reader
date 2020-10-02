// @flow

import { store } from '../../store';

export class DiagnosticModel {
  /**
   * Tests if diagnostic is excluded by the complaint category
   * @param nodes - All nodes, it's passed because I don't have access to state in the model
   * @returns {boolean}
   */
  // TODO: FIXE COMMENT
  static isExcludedByComplaintCategory(algorithm, diagnosticId, medicalCase = store.getState()) {
    const complaintCategory = algorithm.diagnostics[diagnosticId].complaint_category;
    // TODO: Add algorithm
    console.log(medicalCase);
    console.log(medicalCase.nodes[complaintCategory])
    return medicalCase.nodes[complaintCategory].booleanValue(algorithm) === false;
  }
}
