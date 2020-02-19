// @flow

import { HealthCaresModel } from './HealthCares.model';

interface TreatmentInterface {}

export class TreatmentModel extends HealthCaresModel implements TreatmentInterface {
  constructor(props) {
    super(props);

    const { category } = props;

    this.category = category;
  }
}
