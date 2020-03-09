// @flow

import { HealthCaresModel } from './HealthCares.model';

interface TreatmentInterface {}

export class DrugModel extends HealthCaresModel implements TreatmentInterface {
  constructor(props) {
    super(props);

    const { category } = props;

    this.category = category;
  }
}
