// @flow
/* eslint-disable no-case-declarations */
import { NodeModel } from './Node.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';

interface HealthCaresInterface { }

export class HealthCaresModel extends NodeModel implements HealthCaresInterface {
  constructor(props) {
    super(props);

    const {
      description = '',
      label = '',

    } = props;

    this.description = description;
    this.label = label;
    this.healthCareObject = 'healthCares';
  }

  /**
   * Check if a healthCare is excluded by an another
   * @param medicalCase
   * @returns {Array<boolean>}
   */
  isExcluded = (medicalCase) => {
    const finalDiagnostics = FinalDiagnosticModel.getAgreedObject(medicalCase);
    return Object.keys(finalDiagnostics)
      .map((index) => {
        const finalDiagnostic = finalDiagnostics[index];
        return Object.keys(finalDiagnostic[this.healthCareObject]).some((healthCareId) => {
          const healthCare = finalDiagnostic[this.healthCareObject][healthCareId];
          return this.excluded_nodes_ids.includes(parseInt(healthCareId)) && healthCare.agreed === true;
        });
      })
      .some((management) => management);
  };
}
