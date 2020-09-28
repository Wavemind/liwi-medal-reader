// @flow

import { HealthCaresModel } from './HealthCares.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';

interface ManagementInterface {}

export class ManagementModel extends HealthCaresModel implements ManagementInterface {
  constructor(props) {
    super(props);

    const { category = '', excluded_nodes_ids = [], excluding_nodes_ids = [] } = props;

    this.category = category;
    this.excluded_nodes_ids = excluded_nodes_ids;
    this.excluding_nodes_ids = excluding_nodes_ids;
  }

  /**
   * Check if a management is excluded by an another
   * @param medicalCase
   * @returns {Array<boolean>}
   */
  isExcluded = (medicalCase) => {
    const finalDiagnostics = FinalDiagnosticModel.getAgreedObject(medicalCase);
    return Object.keys(finalDiagnostics)
      .map((index) => {
        const finalDiagnostic = finalDiagnostics[index];
        return Object.keys(finalDiagnostic.managements).some((managementId) => {
          const management = finalDiagnostic.managements[managementId];
          return this.excluded_nodes_ids.includes(parseInt(managementId)) && management.agreed === true;
        });
      })
      .some((management) => management);
  };
}
