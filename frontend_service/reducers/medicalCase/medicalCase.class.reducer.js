import { Action, ReducerClass } from 'reducer-class';

import { REHYDRATE } from 'redux-persist';
import find from 'lodash/find';
import findKey from 'lodash/findKey';
import { setMedicalCase } from '../../../src/engine/api/LocalStorage';
import { actions } from '../../actions/types.actions';
import { generateNextBatch } from '../../algorithm/algoTreeDiagnosis';
import { valueFormats } from '../../constants';
import { DiseasesModel } from '../../engine/models/Diseases.model';
import { NodesModel } from '../../engine/models/Nodes.model';
import { VitalSignsModel } from '../../engine/models/VitalSigns.model';

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
    state.vitalSigns = new VitalSignsModel(state.vitalSigns);

    return state;
  }

  // For the diseases we instance it
  _generateInstanceDiseasesNode(state) {
    Object.keys(state.diseases).forEach(
      (i) =>
        (state.diseases[i] = new DiseasesModel({
          ...state.diseases[i],
        })),
    );

    return state;
  }

  // --------------------------       Actions        --------------------------
  // --------------------------------------------------------------------------

  @Action(actions.MC_GENERATE_NEXT_BATCH)
  generateNextBatch(state) {
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

    state.nodes[nodeId] = this._instanceChild({
      ...state.nodes[nodeId],
      qs: ps,
    });

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

    state.nodes[nodeId] = state.nodes._instanceChild({
      ...state.nodes[nodeId],
      dd: dd,
    });

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  @Action(actions.MC_PREDEFINED_SYNDROME_SET_ANSWER)
  psSetAnswer(state, action) {
    const { indexPs, answer } = action.payload;

    state.nodes[indexPs] = state.nodes._instanceChild({
      ...state.nodes[indexPs],
      answer: answer,
    });

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  @Action(actions.MC_SET_VITAL_SIGNS)
  setVitalSigns(state, action) {
    const { index, value } = action.payload;

    return {
      ...state,
      vitalSigns: new VitalSignsModel({
        ...state.vitalSigns,
        [index]: value,
      }),
    };
  }

  /**
   * Sets / calculate the answer in the state
   *
   * @trigger When a question is answered
   * @payload index : Question id
   * @payload value : Answer value
   *                    if numeric question setted value
   *                    if other question answer id
   */
  @Action(actions.SET_ANSWER)
  setAnswer(state, action) {
    const { index, value } = action.payload;

    let answer;
    switch (state.nodes[index].value_format) {
      case valueFormats.int:
      case valueFormats.float:
        answer = findKey(state.nodes[index].answers, (answerCondition) => {
          switch (answerCondition.operator) {
            case 'more_or_equal':
              return value >= Number(answerCondition.value);

            case 'less':
              return value < Number(answerCondition.value);

            case 'between':
              return (
                value >= Number(answerCondition.value.split(',')[0]) &&
                value < Number(answerCondition.value.split(',')[1])
              );
          }
        });
        break;
      case valueFormats.bool:
      case valueFormats.array:
        answer = value;
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(
          '%c --- NODES --- ',
          'background: #FF0000; color: #F6F3ED; padding: 5px',
          `Unhandled question format ${state.nodes[index].display_format}`,
        );
        answer = value;
        break;
    }

    // workaround
    // TODO why sometimes there are string number ? lodash ?
    if (answer !== 'null' && answer !== null) {
      // eslint-disable-next-line no-console
      console.log(
        '%c --- NODES --- ',
        'background: #FF0000; color: #F6F3ED; padding: 5px',
        'Answer is a string ! ',
        answer,
        'Question :',
        index,
      );
      answer = Number(answer);
    }

    // Update answered question with new answer value
    state.nodes[index] = state.nodes._instanceChild({
      ...state.nodes[index],
      answer: answer,
      value: value,
    });

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

    let modelsMedicalCase = this._instanceMedicalCase(action.payload);

    return {
      ...modelsMedicalCase,
    };
  }
}

export default MedicalCaseReducer.create();
