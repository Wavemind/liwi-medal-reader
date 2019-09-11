// @flow

import { HealthCares } from './HealthCares.model';


 interface ManagementInterface {

}

export class ManagementModel extends HealthCares implements ManagementInterface {
  constructor(props) {
    super(props);

    const {
      category = '',
    } = props;

    this.category = category;

  }
}
