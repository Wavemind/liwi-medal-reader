// @flow

import { actions } from '../../actions/types.actions';
import { REHYDRATE } from 'redux-persist';
import { medicalCaseInitialState } from '../../algorithme/medicalCase';
import { setMedicaleCase } from '../../api/LocalStorage';
import findKey from 'lodash/findKey';
import { setInitialCounter } from '../../algorithme/algoTreeDiagnosis';
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
      console.log('MEDICAL_CASE_INITIATE');
      return {
        ...medicalCase,
      };
    }

    case actions.MC_INCREMENT_COUNTER: {
      const { nodeId } = action.payload;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...state.nodes[nodeId],
            counter: state.nodes[nodeId].counter + 1,
          },
        },
      };
    }

    case actions.MC_DECREMENT_COUNTER: {
      const { nodeId } = action.payload;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...state.nodes[nodeId],
            counter: state.nodes[nodeId].counter - 1,
          },
        },
      };
    }

    case actions.MC_QUESTION_SET: {
      const { index, value } = action.payload;
      let answer;

      switch (state.nodes[index].display_format) {
        case 'Input':
          if (value.length > 0) {
            answer = findKey(state.nodes[index].answers, (answerCondition) => {
              switch (answerCondition.operator) {
                case '>=':
                  return value >= Number(answerCondition.value);

                case '<=':
                  return value <= Number(answerCondition.value);

                case '>':
                  return value >= Number(answerCondition.value);

                case '<':
                  return value < Number(answerCondition.value);
              }
            });
          } else {
            answer = null;
          }

          break;

        case 'RadioButton':
          answer = value;
          break;
      }

      // workaround
      // TODO why sometimes there are string number ? lodash ?
      if (answer !== 'null' && answer !== null) {
        answer = Number(answer);
      }

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [index]: {
            ...state.nodes[index],
            answer: answer,
            value: value,
          },
        },
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
      console.log(medicalCase);
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
