// @flow

import { NodeModel } from './Node.model';


export interface ManagementInterface {

}

export class ManagementModel extends NodeModel implements ManagementInterface {
  constructor(props) {
    super(props);
  }
}
