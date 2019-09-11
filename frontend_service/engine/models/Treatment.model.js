// @flow

import { HealthCares } from './HealthCares.model';

interface TreatmentInterface {}

export class TreatmentModel extends HealthCares implements TreatmentInterface {
  constructor(props) {
    super(props);

    const { category } = props;

    this.category = category;
  }
}
