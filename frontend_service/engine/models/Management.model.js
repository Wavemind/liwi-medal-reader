// @flow

import { HealthCaresModel } from './HealthCares.model';


 interface ManagementInterface {

}

export class ManagementModel extends HealthCaresModel implements ManagementInterface {
  constructor(props) {
    super(props);

    const {
      category = '',
    } = props;

    this.category = category;

  }
}
