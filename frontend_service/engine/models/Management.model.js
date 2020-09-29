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
    this.healthCareObject = 'managements';
  }
}
