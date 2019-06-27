import { Action, ReducerClass } from 'reducer-class';

import { REHYDRATE } from 'redux-persist';
import { setMedicalCase } from '../../../src/engine/api/LocalStorage';
import { actions } from '../../actions/types.actions';
import { generateNextBatch } from '../../algorithm/algoTreeDiagnosis';
import find from 'lodash/find';
import { displayFormats } from '../../constants';
import findKey from 'lodash/findKey';
import { DiseasesModel } from '../../engine/models/Diseases.model';
import { NodesModel } from '../../engine/models/Nodes.model';

export const initialState = null;

/*
 * Reducer
 * Catch actions from redux / dispatcher
 * Load MedicalCase on it
 *
 *
 *
 *
 * */
class MedicalCaseReducer extends ReducerClass {
  initialState = {};

  // The state is a MedicalCase
  // Instance it
  _instanceMedicalCase(state) {
    state = this._generateInstanceDiseasesNode(state);
    state.nodes = new NodesModel(state.nodes);
    return state;
  }

  // For the diseases we instance it
  _generateInstanceDiseasesNode(state) {
    Object.keys(state.diseases).forEach(
      (i) =>
        (state.diseases[i] = new DiseasesModel({
          ...state.diseases[i],
        }))
    );

    return state;
  }

  // --------------------------       Actions        --------------------------
  // --------------------------------------------------------------------------

  @Action(actions.MC_CLEAR)
  clearReducer(state, action) {
    return {};
  }

  @Action(actions.MC_GENERATE_NEXT_BATCH)
  generateNextBatch(state, action) {
    let newState = generateNextBatch(state);

    return {
      ...state,
      batches: [...newState.batches],
    };
  }

  @Action(actions.MC_CONDITION_VALUE_QS_CHANGE)
  conditionValuePsChange(state, action) {
    const { nodeId, psId, value } = action.payload;

    const ps = state.nodes[nodeId].qs;

    let changeConditionValue = find(ps, (d) => d.id === psId);
    changeConditionValue.conditionValue = value;

    let newInstanceNode = this._instanceChild({
      ...state.nodes[nodeId],
      qs: ps,
    });

    state.nodes[nodeId] = newInstanceNode;

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  @Action(actions.MC_CONDITION_VALUE_DISEASES_CHANGE)
  conditionValueDiseases(state, action) {
    const { nodeId, diseaseId, value } = action.payload;

    const dd = state.nodes[nodeId].dd;

    let changeConditionValue = find(dd, (d) => d.id === diseaseId);
    changeConditionValue.conditionValue = value;

    let newInstanceNode = state.nodes._instanceChild({
      ...state.nodes[nodeId],
      dd: dd,
    });

    state.nodes[nodeId] = newInstanceNode;

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  @Action(actions.MC_PREDEFINED_SYNDROME_SET_ANSWER)
  psSetAnswer(state, action) {
    const { indexPs, answer } = action.payload;

    let newInstanceNode = state.nodes._instanceChild({
      ...state.nodes[indexPs],
      answer: answer,
    });

    state.nodes[indexPs] = newInstanceNode;

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  @Action(actions.MC_SET_VITAL_SIGNS)
  psSetAnswer(state, action) {
    const { index, value } = action.payload;
    console.log(index, value, state);

    return {
      ...state,
      vitalSigns: {
        ...state.vitalSigns,
        [index]: value,
      },
    };
  }

  @Action(actions.MC_QUESTION_SET)
  questionSet(state, action) {
    const { index, value } = action.payload;

    let answer;

    switch (state.nodes[index].display_format) {
      case displayFormats.input:
        if (value.length > 0) {
          answer = findKey(state.nodes[index].answers, (answerCondition) => {
            // TODO reduce the case when backend is ready
            switch (answerCondition.operator) {
              case 'more_or_equal':
                return value >= Number(answerCondition.value);

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

              case '>=':
                return value >= Number(answerCondition.value);

              // WORKAROUND because JSON is wrong
              case '=>':
                return value >= Number(answerCondition.value);

              case '<=':
                return value <= Number(answerCondition.value);

              case '>':
                return value >= Number(answerCondition.value);

              case '<':
                return value < Number(answerCondition.value);

              case '>=, <':
                return (
                  value >= Number(answerCondition.value.split(',')[0]) &&
                  value < Number(answerCondition.value.split(',')[1])
                );

              case '>, <=':
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
      case undefined:
        answer = value;
        break;
    }

    // workaround
    // TODO why sometimes there are string number ? lodash ?
    if (answer !== 'null' && answer !== null) {
      answer = Number(answer);
    }

    let newInstanceNode = state.nodes._instanceChild({
      ...state.nodes[index],
      answer: answer,
      value: value,
    });

    state.nodes[index] = newInstanceNode;

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  @Action(actions.MC_UPDATE_PATIENT)
  updatePatient(state, action) {
    const { index, value } = action.payload;

    return {
      ...state,
      patient: {
        ...state.patient,
        [index]: value,
      },
    };
  }

  @Action(actions.MC_SET)
  medicalCaseSet(state, action) {
    const { medicalCase } = action.payload;

    if (state !== {} && medicalCase.id !== state.id) {
      setMedicalCase(state);
    }

    let modelsMedicalCase = this._instanceMedicalCase(medicalCase);

    return {
      ...modelsMedicalCase,
    };
  }

  @Action(REHYDRATE)
  rehydrate(state, action) {
    if (
      action.payload === undefined ||
      action.payload === null ||
      action.payload.id === undefined ||
      action.payload.id === null
    ) {
      return initialState;
    }

    let modelsMedicalCase = this._instanceMedicalCase({ ...action.payload });

    return {
      ...modelsMedicalCase,
    };
  }
}

export default MedicalCaseReducer.create();
