// @flow

import { actions } from '../../actions/types.actions';

export const initialState = {};

export default function medicalCaseReducer(
  state: Object = initialState,
  action: Object
) {
  switch (action.type) {
    case actions.SHOW_ALL: {
      const { id, algoId } = action.payload;
      return {
        ...state,
        id,
        algoId,
      };
    }

    default:
      return state;
  }
}
