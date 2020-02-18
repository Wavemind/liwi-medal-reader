// @flow

import { RequirementNodeModel } from './RequirementNodeModel';
import { calculateCondition } from '../../algorithm/conditionsHelpers.algo';

interface InstanceInterface {}

export class InstanceModel implements InstanceInterface {
  constructor(props) {
    const { children, conditions, id, top_conditions, final_diagnostic_id = null } = props;

    this.requirement = new RequirementNodeModel({ conditions, top_conditions });

    this.top_conditions = top_conditions;
    this.id = id;
    this.children = children;
    // This fields tell us that this instance belongs in a diagram and it's not a Healthcare condition
    this.final_diagnostic_id = final_diagnostic_id;
  }

  /**
   * Calculate condition to display a question
   */
  calculateCondition = () => {
    return calculateCondition(this);
  };
}
