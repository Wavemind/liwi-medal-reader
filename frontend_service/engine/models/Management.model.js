// @flow

import { NodeModel } from './Node.model';


 interface ManagementInterface {

}

export class ManagementModel extends NodeModel implements ManagementInterface {
  constructor(props) {
    super(props);

    const {
      category = '',
      description = '',
      label = '',
    } = props;

    this.category = category;
    this.description = description;
    this.label = label;

  }
}
