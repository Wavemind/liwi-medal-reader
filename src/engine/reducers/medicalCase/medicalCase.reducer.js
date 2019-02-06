// @flow

import { actions } from '../../actions/types.actions';
import { REHYDRATE } from 'redux-persist';
import { medicalCaseInitialState } from '../../algorithme/medicalCase';
import { setMedicaleCase } from '../../api/LocalStorage';

// export const initialState = medicalCaseInitialState;
export const initialState = null;

export default function medicalCaseReducer(
  state: Object = initialState,
  action: Object
) {
  switch (action.type) {
    case actions.MEDICAL_CASE_NEW: {
      const { id } = action.payload;
      return {
        ...state,
        id,
      };
    }

    case actions.MEDICAL_CASE_INITIATE: {
      const { medicalCase } = action.payload;
      return {
        ...medicalCase,
      };
    }

    case actions.MC_UPDATE_PATIENT: {
      const { index, value } = action.payload;

      return {
        ...state,
        patient: {
          ...state.patient,
          [index]: value,
        },
      };
    }

    case actions.INTERCEPT_ACTIONS: {
      return {
        ...state,
      };
    }

    case actions.MEDICAL_CASE_SET: {
      const { medicalCase } = action.payload;

      if (state !== {} && medicalCase.id !== state.id) {
        setMedicaleCase(state);
      }

      return {
        ...medicalCase,
      };
    }

    case actions.MC_CLEAR: {
      return {};
    }

    case REHYDRATE: {
      // HERE we get all the stores
      // we must rehydrate all store

      if (
        action.payload === undefined ||
        action.payload === null ||
        action.payload.id === undefined ||
        action.payload.id === null
      ) {
        return initialState;
      }

      return {
        ...action.payload,
      };
    }

    default:
      return state;
  }
}
