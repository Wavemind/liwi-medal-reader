// @flow

import { actions } from '../../actions/types.actions';

export const initialState = {
  answers: {},
  managementsSelected: [],
  treatmentsSelected: [],
  nodes: {},
  final: {},
  increment: 0,
};

export default function medicalCaseReducer(
  state: Object = initialState,
  action: Object
) {
  console.log(action);
  switch (action.type) {
    case actions.MEDICAL_CASES_NEW: {
      const { id } = action.payload;
      return {
        ...state,
        id,
      };
    }

    case actions.MEDICAL_CASES_INITIATE: {
      const { id } = action.payload;
      return {
        ...state,
        id,
        increment: state.increment + 1,
      };
    }

    default:
      return state;
  }
}
