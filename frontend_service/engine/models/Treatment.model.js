// @flow

import { NodeModel } from './Node.model';

interface TreatmentInterface {}

export class TreatmentModel extends NodeModel implements TreatmentInterface {
  constructor(props) {
    super(props);
  }
}
