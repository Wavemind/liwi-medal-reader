// @flow

import { HealthCaresModel } from './HealthCares.model';

export class ManagementModel extends HealthCaresModel {
  constructor(props) {
    super(props);

    this.healthCareObject = 'managements';
  }
}
