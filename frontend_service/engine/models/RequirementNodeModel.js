// @flow

import reduce from 'lodash/reduce';

interface RequirementNodeInterface {
  conditions: Array<Object>;
  top_conditions: Array<Object>;
}

export class RequirementNodeModel implements RequirementNodeInterface {
  constructor(props) {
    const { conditions = [], top_conditions = [] } = props;

    this.conditions = conditions;
    this.top_conditions = top_conditions;
  }

  // TODO: IN PROGRESS
  nodeConditionChecker(state$) {
    // If this is a top parent node
    if (this.top_conditions.length === 0) {
      return true;
    }

    // Loop for top_conditions
    const conditionFinal = this.top_conditions.map((conditions) => {
      return this.comparingTopConditions(state$, conditions);
    });
    // reduce here

    const reduceConditionArrayBoolean = reduce(
      conditionFinal,
      (result, value) => {
        return this.comparingBooleanOr(result, value);
      },
      false
    );

    return reduceConditionArrayBoolean;
  }

  checkOneCondition(state$, wantedId, nodeId, conditionType) {
    switch (conditionType) {
      case 'Answer':
        if (state$.value.nodes[nodeId].answer !== null) {
          // pas sur
          //  Unless it's a priority.
          return state$.value.nodes[nodeId].answer === wantedId;
        }

        return null;

      case 'Condition':
        // TODO here check the id condition nested hooo....
        break;
    }
  }

  // @params [Boolean] firstBoolean [Boolean] secondBoolean
  // @return [Boolean]
  // Return value from both booleans
  //
  //       | True | False | Null
  // ____________________________
  // True  | True | True  | True
  // ____________________________
  // False | True | False | Null
  // ____________________________
  // Null  | True | Null  | Null
  //
  comparingBooleanOr(firstBoolean, secondBoolean) {
    if (firstBoolean === true || secondBoolean === true) {
      return true;
    }
    if (firstBoolean === false && secondBoolean === false) {
      return false;
    }
    if (firstBoolean === null || secondBoolean === null) {
      return null;
    }
  }

  comparingTopConditions(state$, conditions) {
    const { first_id, first_node_id, operator, second_node_id, second_id } = conditions;

    let second_sub_condition;
    let first_sub_condition;

    first_sub_condition = this.checkOneCondition(state$, first_id, first_node_id);

    if (operator === null) {
      return first_sub_condition;
    }
    second_sub_condition = this.checkOneCondition(state$, second_id, second_node_id);

    if (operator === 'AND') {
      return first_sub_condition && second_sub_condition;
    }
    if (operator === 'OR') {
      return this.comparingBooleanOr(first_sub_condition, second_sub_condition);
    }

    return null;
  }
}
