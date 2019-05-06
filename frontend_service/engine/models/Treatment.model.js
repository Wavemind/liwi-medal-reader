// @flow

import { NodeModel } from './Node.model';


export interface TreatmentInterface {

}

export class TreatmentModel extends NodeModel implements TreatmentInterface {
  constructor(props) {
    super(props);
  }
}
