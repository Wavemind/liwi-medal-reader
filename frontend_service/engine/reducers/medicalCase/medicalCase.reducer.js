// @flow

import { actions } from '../../actions/types.actions';
import { REHYDRATE } from 'redux-persist';
import { setMedicalCase } from '../../../../src/engine/api/LocalStorage';
import findKey from 'lodash/findKey';
import { generateNextBatch } from '../../algorithm/algoTreeDiagnosis';
import { displayFormats } from '../../../constants';

export const initialState = null;

export default function medicalCaseReducer(
  state: Object = initialState,
  action: Object,
) {
  switch (action.type) {
    case actions.MC_GENERATE_NEXT_BATCH: {
      let newState = generateNextBatch(state);

      return {
        ...state,
        batches: [...newState.batches],
      };
    }

    case actions.MC_CONDITION_VALUE_CHANGE: {
      const { nodeId, diseaseId, value } = action.payload;

      const dd = state.nodes[nodeId].dd;
      dd[diseaseId].conditionValue = value;

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...state.nodes[nodeId],
            dd: dd,
          },
        },
      };
    }

    case actions.MC_PREDEFINED_SYNDROME_SET_ANSWER: {
      const { indexPs, answer } = action.payload;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [indexPs]: {
            ...state.nodes[indexPs],
            answer: answer,
          },
        },
      };
    }

    case actions.MC_QUESTION_SET: {
      const { index, value } = action.payload;
      let answer;

      console.log(value, index)

      switch (state.nodes[index].display_format) {
        case displayFormats.input:
          if (value.length > 0) {
            answer = findKey(state.nodes[index].answers, (answerCondition) => {
              switch (answerCondition.operator) {
                case 'more_or_equal':
                  return value >= Number(answerCondition.value);

                case 'less_or_equal':
                  return value <= Number(answerCondition.value);

                case 'more':
                  return value > Number(answerCondition.value);

                case 'less':
                  return value < Number(answerCondition.value);

                case 'more_or_equal_and_less':
                  return (
                    value >= Number(answerCondition.value.split(',')[0]) &&
                    value < Number(answerCondition.value.split(',')[1])
                  );

                case 'between':
                  return (
                    value >= Number(answerCondition.value.split(',')[0]) &&
                    value < Number(answerCondition.value.split(',')[1])
                  );

                case 'more_and_less':
                  return (
                    value > Number(answerCondition.value.split(',')[0]) &&
                    value < Number(answerCondition.value.split(',')[1])
                  );

                case 'more_and_less_or_equal':
                  return (
                    value > Number(answerCondition.value.split(',')[0]) &&
                    value <= Number(answerCondition.value.split(',')[1])
                  );
              }
            });
          } else {
            answer = null;
          }

          break;

        case displayFormats.radioButton:
          answer = value;
          break;
        case displayFormats.list:
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

    case actions.MC_SET: {
      const { medicalCase } = action.payload;
      if (state !== {} && medicalCase.id !== state.id) {
        setMedicalCase(state);
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
