// @flow

import { RequirementNodeModel } from './RequirementNodeModel';

interface InstanceInterface {}

export class InstanceModel implements InstanceInterface {
  constructor(props) {
    const { children, conditions, id, top_conditions } = props;

    this.requirement = new RequirementNodeModel({ conditions, top_conditions });

    this.top_conditions = top_conditions;
    this.id = id;
    this.children = children;
  }
}
